import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import StepBar from "@/components/ui/StepBar";
import StepPetReason from "./components/StepPetReason";
import DoctorList from "./components/DoctorList";
import StepSchedule from "./components/StepSchedule";
import StepConfirm from "./components/StepConfirm";
import ConfirmSuccess from "./components/ConfirmSuccess";
import { Doctor } from "@/types/index";
import { AppointmentReason, AppointmentMode, APPOINTMENT_REASONS } from "@/data/mock/appointmentOptions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { findPetByName, PET_PROFILES } from "@/data/mock/pet";
import { toLocalISODate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/useToast";
import { addAppointment, AppointmentRecord } from "@/utils/medicalHistory";

/**
 * Map prefill reason id từ các luồng khác -> appointment reason id.
 *
 * Hai nguồn prefill:
 * 1. AI Check: `?reason=<scenario.id>` (xem data/mock/aiScenarios.ts)
 * 2. Vaccination: `?reason=vaccine` (id trực tiếp trùng APPOINTMENT_REASONS)
 *
 * Fallback về "general-checkup" nếu không match.
 */
const PREFILL_TO_REASON: Record<string, string> = {
  // AI scenarios
  "respiratory-mild": "general-checkup",
  "respiratory-severe": "general-checkup",
  "digestive-mild": "general-checkup",
  "digestive-severe": "emergency",
  "dermatology-mild": "skin-issue",
  "dermatology-severe": "skin-issue",
  "musculoskeletal": "bone-joint",
  "behavioral": "behavior",
  "parasite": "general-checkup",
  "allergy": "skin-issue",
  "fever": "general-checkup",
  "poisoning": "emergency",
  "blood-parasite": "general-checkup",
  "eye": "general-checkup",
  "dental": "general-checkup",
  // Vaccine (id trực tiếp, đã tồn tại trong APPOINTMENT_REASONS)
  "vaccine": "vaccine",
  "tẩy-giun": "tẩy-giun",
};

/** Trả về ngày mai theo local timezone (YYYY-MM-DD). */
const getTomorrow = (): Date => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

/** Độ dài tối đa cho symptom note (ký tự). */
const MAX_NOTE_LEN = 500;

/**
 * Chuẩn hoá symptom note:
 *  - Bỏ HTML tags cơ bản (tránh XSS khi sau này render bằng dangerouslySetInnerHTML)
 *  - Trim + giới hạn độ dài
 *  - Chuyển newline thành space (gọn hơn cho list/UI)
 */
const sanitizeNote = (raw: string): string => {
  return raw
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/[\r\n\t]+/g, " ")        // newline / tab -> space
    .replace(/\s{2,}/g, " ")           // collapse whitespace
    .trim()
    .slice(0, MAX_NOTE_LEN);
};

const AppointmentPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState<string | null>(null);
  const [reason, setReason] = useState<AppointmentReason | null>(null);
  const [symptomNote, setSymptomNote] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => toLocalISODate(getTomorrow()));
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMode, setSelectedMode] = useState<AppointmentMode | null>(null);
  const prefillAppliedRef = useRef(false);

  const steps = ["Thú cưng & Lý do", "Chọn bác sĩ", "Lịch & hình thức", "Xác nhận"];

  /**
   * Nếu user mở app trước 0h và để qua ngày, "ngày mai" cũ (tính lúc mount)
   * đã trở thành hôm nay → booking trong quá khứ → bị lỗi.
   * Hook kiểm tra mỗi phút: nếu selectedDate < today → reset về "mai".
   */
  useEffect(() => {
    const tick = () => {
      const today = toLocalISODate(new Date());
      if (selectedDate < today) {
        setSelectedDate(toLocalISODate(getTomorrow()));
        showToast("Đã cập nhật ngày khám sang ngày mai.", "info");
      }
    };
    tick(); // chạy ngay khi mount
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Helper: trả về true nếu pet thuộc về user hiện tại (chống cross-user booking).
   *
   * Vì PET_PROFILES key theo user.name, tìm ownerName = user?.name → check pet thuộc.
   * Nếu pet KHÔNG thuộc user (vd share link từ user khác) → trả false.
   */
  const isPetOwnedByCurrentUser = (petName: string | null): boolean => {
    if (!petName) return false;
    const ownerName = user?.name;
    if (!ownerName) return true; // chưa login → cho qua, StepPetReason sẽ filter
    const ownerPet = PET_PROFILES[ownerName];
    return ownerPet?.name === petName;
  };

  // Prefill từ AI Check (?fromAI=1&reason=...&pet=...&notes=...)
  // Chỉ chạy 1 lần khi mount; sau đó user tự do chỉnh sửa state.
  useEffect(() => {
    if (prefillAppliedRef.current) return;
    const fromAI = searchParams.get("fromAI") === "1";
    if (!fromAI) {
      prefillAppliedRef.current = true;
      return;
    }

    const pet = searchParams.get("pet");
    const reasonId = searchParams.get("reason");
    const notes = searchParams.get("notes") ?? "";

    // Validate petId có tồn tại trong hệ thống không (tránh URL giả mạo / rỗng).
    // Lưu ý: petId gửi từ AI Check là pet.name (vd "Bé Mít"), KHÔNG phải user.name.
    // PET_PROFILES key là user.name → phải dùng findPetByName thay vì tra cứu trực tiếp.
    if (pet && pet.length > 0) {
      const matchedPet = findPetByName(pet);
      if (matchedPet) {
        setPetId(pet);
      } else {
        showToast(`Pet "${pet}" không tồn tại trong hệ thống. Vui lòng chọn thú cưng khác.`, "warning");
      }
    } else if (fromAI) {
      // fromAI=1 mà pet rỗng → cảnh báo để user biết cần chọn
      showToast("Vui lòng chọn thú cưng cần khám.", "warning");
    }
    // Giới hạn notes + sanitize (strip HTML, trim, giới hạn ký tự).
    if (notes) setSymptomNote(sanitizeNote(notes));

    // Map prefill reason id -> appointment reason id (chính xác)
    let mappedReasonId: string | null = null;
    if (reasonId) {
      if (PREFILL_TO_REASON[reasonId]) {
        mappedReasonId = PREFILL_TO_REASON[reasonId];
      } else if (APPOINTMENT_REASONS.some(r => r.id === reasonId)) {
        // reasonId là id hợp lệ của APPOINTMENT_REASONS (vd: "vaccine", "tẩy-giun")
        mappedReasonId = reasonId;
      } else {
        // reasonId không xác định → cảnh báo + fallback
        showToast(`Lý do khám "${reasonId}" không hợp lệ. Đã chọn "Khám tổng quát".`, "warning");
        mappedReasonId = "general-checkup";
      }
    }
    const targetReason = mappedReasonId
      ? APPOINTMENT_REASONS.find(r => r.id === mappedReasonId) ?? null
      : null;
    if (targetReason) setReason(targetReason);

    prefillAppliedRef.current = true;
  }, [searchParams, showToast]);

  const handleReset = () => {
    // Reset tất cả state về mặc định
    setStep(1);
    setPetId(null);
    setReason(null);
    setSymptomNote("");
    setSelectedDoctor(null);
    setSelectedDate(toLocalISODate(getTomorrow()));
    setSelectedTime("");
    setSelectedMode(null);
    setSavedCode(null);
    // Cho phép prefill lại nếu user vào từ link AI Check / Vaccination.
    prefillAppliedRef.current = false;
    // Xoá searchParams (?fromAI=1...) để tránh prefill lại không mong muốn
    // khi user refresh hoặc back/forward trong cùng session.
    if (searchParams.toString()) {
      setSearchParams({}, { replace: true });
    }
  };

  /**
   * Lưu lịch hẹn vào localStorage NGAY tại đây (single source of truth).
   * Trước đó logic lưu nằm trong ConfirmSuccess useEffect → có nguy cơ double-save
   * nếu user refresh hoặc remount component. Bây giờ chỉ lưu đúng 1 lần khi user
   * bấm "Xác nhận đặt lịch" tại step 4.
   */
  const [savedCode, setSavedCode] = useState<string | null>(null);

  const handleConfirm = () => {
    // Validate lần cuối (đề phòng state stale khi back/forward step).
    if (!petId || !findPetByName(petId)) {
      showToast("Vui lòng chọn thú cưng hợp lệ.", "error");
      setStep(1);
      return;
    }
    // Chống đặt lịch cho pet KHÔNG thuộc user hiện tại (vd share link giả mạo).
    if (!isPetOwnedByCurrentUser(petId)) {
      showToast(`Pet "${petId}" không thuộc tài khoản ${user?.name ?? "của bạn"}. Vui lòng chọn thú cưng khác.`, "error");
      setPetId(null);
      setStep(1);
      return;
    }
    if (!reason || !selectedDoctor || !selectedDate || !selectedTime || !selectedMode) {
      showToast("Vui lòng điền đầy đủ thông tin trước khi xác nhận.", "error");
      return;
    }

    // Tạo mã đặt lịch ngắn gọn (APT-XXXXXX, alphabet không nhầm lẫn).
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "APT-";
    for (let i = 0; i < 6; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // Tính phí tổng (giống StepConfirm)
    const baseFee = selectedDoctor.fee;
    const totalFee = Math.round(baseFee * selectedMode.feeMultiplier);

    // Tìm pet profile đúng theo petId (đã validate ở trên)
    const pet = findPetByName(petId)!;
    const record: AppointmentRecord = {
      id: code,
      petId,
      petName: pet.name,
      doctorId: selectedDoctor.id,
      doctorName: `${selectedDoctor.title} ${selectedDoctor.name}`,
      doctorSpec: selectedDoctor.specShort,
      reasonId: reason.id,
      reasonLabel: reason.label,
      date: selectedDate,
      time: selectedTime,
      modeId: selectedMode.id,
      modeLabel: selectedMode.label,
      fee: totalFee,
      symptomNote: symptomNote.trim(),
      createdAt: new Date().toISOString(),
    };
    addAppointment(record);
    setSavedCode(code);
    setStep(5);
  };

  return (
    <div className="space-y-6">
      <PageHeader />
      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-sm">
        <StepBar steps={steps} currentStep={step} onStepClick={setStep} />

        {step === 1 && (
          <StepPetReason
            petId={petId}
            setPetId={setPetId}
            reason={reason}
            setReason={setReason}
            symptomNote={symptomNote}
            setSymptomNote={setSymptomNote}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <DoctorList
            selectedDoctor={selectedDoctor}
            onSelect={setSelectedDoctor}
            suggestSpec={reason?.suggestSpec}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepSchedule
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <StepConfirm
            petId={petId}
            reason={reason}
            symptomNote={symptomNote}
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            mode={selectedMode}
            onBack={() => setStep(3)}
            onConfirm={handleConfirm}
          />
        )}
        {step === 5 && (
          <ConfirmSuccess
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            mode={selectedMode}
            petId={petId}
            reason={reason}
            symptomNote={symptomNote}
            savedCode={savedCode ?? undefined}
            onReset={handleReset}
          />
        )}
      </Card>
    </div>
  );
};

export default AppointmentPage;