import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { Doctor } from "@/types/index";
import { AppointmentReason, AppointmentMode } from "@/data/mock/appointmentOptions";
import { findPetByName, PetProfile } from "@/data/mock/pet";
import { formatDateVN } from "@/utils/dateUtils";

interface StepConfirmProps {
  petId: string | null;
  reason: AppointmentReason | null;
  symptomNote: string;
  doctor: Doctor | null;
  date: string;
  time: string;
  mode: AppointmentMode | null;
  onBack: () => void;
  onConfirm: () => void;
}

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const StepConfirm: React.FC<StepConfirmProps> = ({
  petId,
  reason,
  symptomNote,
  doctor,
  date,
  time,
  mode,
  onBack,
  onConfirm,
}) => {
  const pet: PetProfile | undefined = petId ? findPetByName(petId) : undefined;
  const baseFee = doctor?.fee ?? 0;
  const totalFee = mode ? Math.round(baseFee * mode.feeMultiplier) : baseFee;

  // Validate tất cả trường BẮT BUỘC phải có trước khi cho xác nhận.
  // Nếu thiếu bất kỳ trường nào → hiển thị banner cảnh báo và disable button.
  const missingFields: string[] = [];
  if (!pet) missingFields.push("thú cưng");
  if (!reason) missingFields.push("lý do khám");
  if (!doctor) missingFields.push("bác sĩ");
  if (!date) missingFields.push("ngày khám");
  if (!time) missingFields.push("khung giờ");
  if (!mode) missingFields.push("hình thức khám");
  const canConfirm = missingFields.length === 0;

  const summary = [
    {
      icon: "🐾",
      label: "Thú cưng",
      value: pet ? `${pet.name} • ${pet.breed}` : "—",
      sub: pet ? `${pet.emoji} ${pet.age} • ${pet.weight}kg` : undefined,
    },
    {
      icon: reason?.emoji ?? "📋",
      label: "Lý do khám",
      value: reason?.label ?? "—",
      sub: reason?.description,
    },
    {
      icon: doctor?.avatar ?? "👨‍⚕️",
      label: "Bác sĩ",
      value: doctor ? `${doctor.title} ${doctor.name}` : "—",
      sub: doctor ? `${doctor.specShort} • ${doctor.clinic}` : undefined,
    },
    {
      icon: "📅",
      label: "Ngày khám",
      value: date ? formatDateVN(date) : "—",
      sub: time ? `${time} • ${mode?.label ?? ""}` : undefined,
    },
    {
      icon: mode?.emoji ?? "🏥",
      label: "Hình thức",
      value: mode?.label ?? "—",
      sub: mode?.description,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-xl text-darkbg flex items-center gap-2">
          ✅ Xác nhận thông tin
        </h2>
        <p className="text-muted text-sm mt-1">Vui lòng kiểm tra kỹ trước khi đặt lịch.</p>
      </div>

      {/* Summary cards */}
      <div className="space-y-2.5">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-2xl shrink-0">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">{s.label}</div>
              <div className="font-extrabold text-sm text-darkbg mt-0.5 truncate">{s.value}</div>
              {s.sub && <div className="text-xs text-muted font-bold mt-0.5 truncate">{s.sub}</div>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Symptom note */}
      {symptomNote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-violet-50 border border-violet-100"
        >
          <div className="text-[10px] font-extrabold text-violet-700 uppercase tracking-wider mb-1.5">
            📝 Mô tả triệu chứng
          </div>
          <p className="text-sm text-violet-900 leading-relaxed">{symptomNote}</p>
        </motion.div>
      )}

      {/* Fee breakdown */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
        <div className="text-xs font-extrabold text-darkbg uppercase tracking-wider mb-3">
          💰 Chi tiết phí
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted font-bold">Phí khám cơ bản</span>
            <span className="font-extrabold text-darkbg">{formatVND(baseFee)}</span>
          </div>
          {mode && mode.feeMultiplier !== 1 && (
            <div className="flex justify-between">
              <span className="text-muted font-bold">
                Hình thức {mode.label} ({mode.feeMultiplier > 1 ? "+" : ""}
                {Math.round((mode.feeMultiplier - 1) * 100)}%)
              </span>
              <span className={`font-extrabold ${mode.feeMultiplier > 1 ? "text-amber-600" : "text-emerald-600"}`}>
                {mode.feeMultiplier > 1 ? "+" : ""}
                {formatVND(totalFee - baseFee)}
              </span>
            </div>
          )}
          <div className="border-t border-primary/20 pt-2 mt-2 flex justify-between items-baseline">
            <span className="font-extrabold text-darkbg">Tổng cộng</span>
            <span className="text-2xl font-extrabold text-gradient">{formatVND(totalFee)}</span>
          </div>
          <div className="text-[10px] text-muted italic">
            * Thanh toán tại phòng khám hoặc qua ví điện tử. Có thể huỷ trước 24h.
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      {reason?.isEmergency && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex gap-3"
        >
          <span className="text-3xl">🚑</span>
          <div className="text-xs text-rose-800 leading-relaxed">
            <strong className="font-extrabold">Đây là tình huống khẩn cấp.</strong> Vui lòng gọi ngay{" "}
            <strong className="font-extrabold">1900 1234 56</strong> để được hỗ trợ nhanh nhất. Đặt lịch online có thể mất vài phút xác nhận.
          </div>
        </motion.div>
      )}

      <div className="flex justify-between pt-3">
        <Button variant="ghost" onClick={onBack}>← Quay lại</Button>
        <div className="flex flex-col items-end gap-1">
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="px-8 btn-rainbow"
            title={!canConfirm ? "Vui lòng quay lại và điền các trường còn thiếu" : ""}
          >
            ✓ Xác nhận đặt lịch
          </Button>
          {!canConfirm && (
            <div className="text-[10px] text-rose-600 font-bold">
              ⚠️ Còn thiếu: {missingFields.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepConfirm;