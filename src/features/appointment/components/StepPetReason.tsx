import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PET_PROFILES, findPetByName, PetProfile } from "@/data/mock/pet";
import { APPOINTMENT_REASONS, AppointmentReason } from "@/data/mock/appointmentOptions";

interface StepPetReasonProps {
  petId: string | null;
  setPetId: (id: string) => void;
  reason: AppointmentReason | null;
  setReason: (r: AppointmentReason) => void;
  symptomNote: string;
  setSymptomNote: (s: string) => void;
  onNext: () => void;
}

const StepPetReason: React.FC<StepPetReasonProps> = ({
  petId,
  setPetId,
  reason,
  setReason,
  symptomNote,
  setSymptomNote,
  onNext,
}) => {
  const { user } = useAuth();

  // Lấy pet thuộc sở hữu user hiện tại.
  // Trong production: query từ server theo userId.
  // Trong demo: mapping qua DEMO_ACCOUNTS (1 user = 1 pet chính), fallback hiển thị pet của user đó.
  const myPets: PetProfile[] = useMemo(() => {
    if (!user?.name) return [PET_PROFILES["Yến Nhi"]];
    const owned = PET_PROFILES[user.name];
    return owned ? [owned] : [PET_PROFILES["Yến Nhi"]];
  }, [user?.name]);

  // Nếu petId được prefill từ URL không thuộc danh sách pet của user hiện tại,
  // hiển thị banner cảnh báo và vẫn cho phép giữ (vd share link).
  // petId gửi tới đây là pet NAME (vd "Bé Mít") → dùng findPetByName.
  const petProfile = petId ? findPetByName(petId) : undefined;
  const petExists = !!petProfile;
  const petIsMine = petId ? myPets.some(p => p.name === petId) : true;

  const canNext = petId && reason && petExists && petIsMine;

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-extrabold text-xl text-darkbg flex items-center gap-2">
          🐾 Ai là thú cưng hôm nay?
        </h2>
        <p className="text-muted text-sm mt-1">
          Chọn bé cần khám và cho chúng tôi biết lý do bạn đặt lịch.
        </p>
      </div>

      {/* Pet selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-darkbg uppercase tracking-wider">
          1. Chọn thú cưng
        </label>

        {/* Cảnh báo nếu petId được prefill không thuộc user hiện tại */}
        {petId && !petExists && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2"
          >
            <span className="text-xl shrink-0">⚠️</span>
            <div className="text-xs text-rose-800 font-semibold">
              Thú cưng <strong>"{petId}"</strong> không tồn tại trong hệ thống. Vui lòng chọn lại.
            </div>
          </motion.div>
        )}
        {petId && petExists && !petIsMine && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2"
          >
            <span className="text-xl shrink-0">ℹ️</span>
            <div className="text-xs text-amber-800 font-semibold">
              Đặt lịch cho <strong>{petId}</strong> (chưa thuộc hồ sơ của bạn). Sau khi đặt sẽ được lưu vào danh sách thú cưng.
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {myPets.map(p => {
            const isSelected = petId === p.name;
            return (
              <motion.button
                key={p.name}
                type="button"
                onClick={() => setPetId(p.name)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left overflow-hidden ${
                  isSelected
                    ? "border-primary bg-gradient-to-br from-primary-light/50 to-white shadow-md"
                    : "border-gray-100 bg-white hover:border-primary/40 hover:bg-primary-mid/20"
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs"
                  >
                    ✓
                  </motion.div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.avatarBg} flex items-center justify-center text-3xl shadow-md mb-2`}>
                  {p.emoji}
                </div>
                <div className="font-extrabold text-sm text-darkbg leading-tight">{p.name}</div>
                <div className="text-[10px] text-muted font-bold mt-0.5 line-clamp-1">{p.breed}</div>
              </motion.button>
            );
          })}
        </div>
        <div className="text-xs text-muted italic mt-2">
          💡 Đặt lịch cho <strong>{myPets[0]?.name}</strong> ({myPets[0]?.breed}). Muốn thêm thú cưng? Vào Hồ sơ thú cưng.
        </div>
      </div>

      {/* Reason selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-darkbg uppercase tracking-wider">
          2. Lý do khám
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {APPOINTMENT_REASONS.map((r, i) => {
            const isSelected = reason?.id === r.id;
            return (
              <motion.button
                key={r.id}
                type="button"
                onClick={() => setReason(r)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left ${
                  r.isEmergency
                    ? isSelected
                      ? "border-rose-500 bg-gradient-to-br from-rose-100 to-red-50 shadow-md"
                      : "border-rose-200 bg-rose-50/40 hover:border-rose-400"
                    : isSelected
                      ? "border-primary bg-gradient-to-br from-primary-light/40 to-white shadow-md"
                      : "border-gray-100 bg-white hover:border-primary/40"
                }`}
              >
                {r.isEmergency && (
                  <div className="absolute -top-1.5 -right-1.5">
                    <Badge variant="danger" className="text-[9px] py-0 px-1.5">!</Badge>
                  </div>
                )}
                <div className="text-3xl mb-1.5">{r.emoji}</div>
                <div className={`font-extrabold text-xs leading-tight ${r.isEmergency ? "text-rose-700" : "text-darkbg"}`}>
                  {r.label}
                </div>
                <div className="text-[10px] text-muted font-bold mt-0.5 leading-tight line-clamp-2">
                  {r.description}
                </div>
              </motion.button>
            );
          })}
        </div>
        {reason && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2"
          >
            <Badge variant="info">💡 Gợi ý bác sĩ</Badge>
            <span className="text-xs text-muted font-bold">{reason.suggestSpec}</span>
          </motion.div>
        )}
      </div>

      {/* Symptom note */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-darkbg uppercase tracking-wider">
          3. Mô tả triệu chứng <span className="text-muted normal-case font-medium">(tuỳ chọn)</span>
        </label>
        <Textarea
          value={symptomNote}
          onChange={e => setSymptomNote(e.target.value)}
          placeholder="Ví dụ: Bé ho khan 3 ngày, có chảy nước mũi, ăn uống bình thường..."
          rows={4}
          className="resize-none"
        />
        <div className="text-[10px] text-muted italic">
          🔒 Mô tả này chỉ bác sĩ đặt lịnh được xem. Tránh chia sẻ thông tin nhạy cảm khác.
        </div>
      </div>

      <div className="flex justify-end pt-3">
        <Button variant="primary" onClick={onNext} disabled={!canNext} className="px-8">
          Tiếp tục →
        </Button>
      </div>
    </div>
  );
};

export default StepPetReason;