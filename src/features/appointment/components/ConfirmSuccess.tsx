import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Doctor } from "@/types/index";
import { AppointmentReason, AppointmentMode } from "@/data/mock/appointmentOptions";
import { findPetByName, PetProfile } from "@/data/mock/pet";
import { formatDateVN, formatDateTimeLocal } from "@/utils/dateUtils";

interface ConfirmSuccessProps {
  doctor: Doctor | null;
  date: string;
  time: string;
  mode: AppointmentMode | null;
  petId: string | null;
  reason: AppointmentReason | null;
  symptomNote?: string;
  /** Mã đặt lịch được tạo bởi AppointmentPage.handleConfirm (single source). */
  savedCode?: string;
  onReset: () => void;
}

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

// Confetti component
const Confetti: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{
          y: -20,
          x: Math.random() * 100 + "%",
          opacity: 1,
          rotate: 0,
        }}
        animate={{
          y: "120%",
          rotate: Math.random() * 720 - 360,
          opacity: 0,
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          delay: Math.random() * 0.5,
          ease: "easeIn",
        }}
        className="absolute w-2 h-3"
        style={{
          background: ["#F05A7E", "#A855F7", "#6366F1", "#10B981", "#F59E0B"][i % 5],
          borderRadius: i % 2 === 0 ? "50%" : "0",
        }}
      />
    ))}
  </div>
);

const ConfirmSuccess: React.FC<ConfirmSuccessProps> = ({
  doctor,
  date,
  time,
  mode,
  petId,
  reason,
  symptomNote = "",
  savedCode,
  onReset,
}) => {
  const navigate = useNavigate();
  const pet: PetProfile | undefined = petId ? findPetByName(petId) : undefined;
  const totalFee = doctor && mode ? Math.round(doctor.fee * mode.feeMultiplier) : doctor?.fee ?? 0;

  // Lưu đã được thực hiện bởi AppointmentPage.handleConfirm (single source of truth).
  // Ở đây chỉ dùng savedCode để hiển thị mã đặt lịch, hoặc fallback nếu chưa có.
  const code = savedCode ?? "—";

  // Countdown tới giờ khám
  const [countdown, setCountdown] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      if (!date || !time) {
        setCountdown("—");
        return;
      }
            // Kết hợp date (YYYY-MM-DD) + time (HH:mm) theo local timezone (không qua UTC).
      const target = formatDateTimeLocal(date, time);
      if (isNaN(target.getTime())) {
        setCountdown("—");
        return;
      }
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Đã tới giờ khám");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days > 0) setCountdown(`${days} ngày ${hours} giờ`);
      else if (hours > 0) setCountdown(`${hours} giờ ${minutes} phút`);
      else setCountdown(`${minutes} phút`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [date, time]);

  return (
    <div className="text-center py-2 space-y-5 relative">
      <Confetti />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-2xl ring-8 ring-emerald-100"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="text-5xl"
        >
          ✓
        </motion.span>
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-emerald-400"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-extrabold text-2xl text-darkbg">Đặt lịch thành công! 🎉</h2>
        <p className="text-muted text-sm mt-1">Thông tin đã được gửi đến bác sĩ và lưu vào hồ sơ.</p>
        <div className="mt-2 inline-flex items-center gap-1.5">
          <Badge variant="info">📋 Mã đặt lịch: {code}</Badge>
        </div>
      </motion.div>

      {/* Pet hero mini */}
      {pet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl"
          >
            {pet.emoji}
          </motion.div>
          <span className="font-extrabold text-sm text-darkbg">{pet.name} sắp được khám nè! ✨</span>
        </motion.div>
      )}

      {/* Detail card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-md mx-auto p-5 rounded-2xl border border-gray-100 bg-white text-left space-y-3 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl" />
        {doctor && (
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 relative z-10">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${doctor.avatarBg} flex items-center justify-center text-2xl shadow-sm`}>
              {doctor.avatar}
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Bác sĩ</div>
              <div className="font-extrabold text-sm text-darkbg">{doctor.title} {doctor.name}</div>
              <div className="text-xs text-primary font-bold">{doctor.specShort}</div>
            </div>
          </div>
        )}
        <div className="space-y-2 text-sm relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-muted font-bold">📅 Ngày khám</span>
            <span className="font-extrabold text-darkbg">{formatDateVN(date)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted font-bold">⏰ Khung giờ</span>
            <span className="font-extrabold text-primary">{time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted font-bold">{mode?.emoji} Hình thức</span>
            <span className="font-extrabold text-darkbg">{mode?.label}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted font-bold">{reason?.emoji} Lý do</span>
            <span className="font-extrabold text-darkbg text-right">{reason?.label}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-muted font-bold">💰 Tổng phí</span>
            <span className="font-extrabold text-gradient text-base">{formatVND(totalFee)}</span>
          </div>
        </div>

        {/* Symptom note inline */}
        {symptomNote && symptomNote.trim() && (
          <div className="mt-3 p-3 rounded-xl bg-violet-50 border border-violet-100 relative z-10">
            <div className="text-[10px] font-extrabold text-violet-700 uppercase tracking-wider mb-1">
              📝 Mô tả triệu chứng
            </div>
            <p className="text-xs text-violet-900 leading-relaxed line-clamp-3 italic">"{symptomNote}"</p>
          </div>
        )}
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-sm font-extrabold text-primary"
      >
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          ⏱️
        </motion.span>
        Còn {countdown} nữa là tới giờ khám
      </motion.div>

      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="max-w-md mx-auto text-left space-y-2"
      >
        <div className="text-xs font-extrabold text-muted uppercase tracking-wider">📌 Bước tiếp theo</div>
        <div className="space-y-1.5">
          {[
            "✅ Email xác nhận đã gửi đến hộp thư của bạn",
            "🔔 Nhắc nhở sẽ gửi trước 24 giờ & 1 giờ",
            "📞 Bác sĩ sẽ gọi xác nhận trước 30 phút (nếu khám online)",
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="text-xs text-darkbg font-semibold"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="pt-3 flex flex-wrap justify-center gap-2">
        <Button variant="primary" onClick={onReset} className="px-8">
          📅 Đặt lịch khác
        </Button>
        <Button variant="outline" onClick={() => navigate("/dashboard/appointments")} className="px-8">
          📋 Xem hồ sơ lịch hẹn
        </Button>
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          🏠 Về Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ConfirmSuccess;