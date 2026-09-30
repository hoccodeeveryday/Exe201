import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import {
  TIME_SLOTS_MORNING,
  TIME_SLOTS_AFTERNOON,
  TIME_SLOTS_EVENING,
} from "@/data/mock/doctors";
import { APPOINTMENT_MODES, AppointmentMode } from "@/data/mock/appointmentOptions";
import { nextNDays, toLocalISODate, fromLocalISODate } from "@/utils/dateUtils";

interface StepScheduleProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  selectedMode: AppointmentMode | null;
  onSelectMode: (mode: AppointmentMode) => void;
  onBack: () => void;
  onNext: () => void;
}

const SHORT_WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const FULL_WEEKDAYS = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const formatVNDate = (iso: string): { weekday: string; date: string; full: string } => {
  const d = fromLocalISODate(iso);
  return {
    weekday: SHORT_WEEKDAYS[d.getDay()],
    date: `${d.getDate()}/${d.getMonth() + 1}`,
    full: `${FULL_WEEKDAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
  };
};

const StepSchedule: React.FC<StepScheduleProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  onSelectTime,
  selectedMode,
  onSelectMode,
  onBack,
  onNext,
}) => {
  // Generate 14 ngày kế tiếp (theo local timezone, tránh lệch ngày qua UTC).
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = nextNDays(14, today);
    return next.map((d, i) => ({
      iso: toLocalISODate(d),
      day: d.getDate(),
      month: d.getMonth() + 1,
      weekday: SHORT_WEEKDAYS[d.getDay()],
      isToday: i === 0,
      isTomorrow: i === 1,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    }));
  }, []);

  const renderTimeGroup = (label: string, icon: string, slots: typeof TIME_SLOTS_MORNING) => (
    <div className="space-y-2">
      <div className="text-xs font-extrabold text-muted uppercase tracking-wider flex items-center gap-1.5">
        <span>{icon}</span> {label}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map(t => {
          const isSelected = selectedTime === t.time;
          return (
            <motion.button
              key={t.time}
              type="button"
              disabled={!t.available}
              onClick={() => t.available && onSelectTime(t.time)}
              whileHover={t.available ? { y: -2 } : {}}
              whileTap={t.available ? { scale: 0.95 } : {}}
              className={`relative px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 outline-none ${
                !t.available
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : isSelected
                    ? "bg-gradient-to-r from-primary to-[#FF8FAB] text-white border-transparent shadow-[0_4px_12px_rgba(240,90,126,0.25)]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {t.time}
              {!t.available && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="absolute inset-x-2 top-1/2 h-px bg-gray-200" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const canNext = selectedTime && selectedMode;

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-extrabold text-xl text-darkbg">Chọn ngày, giờ & hình thức khám</h2>
        <p className="text-muted text-sm mt-1">Bạn có thể đặt lịch trước tối đa 14 ngày.</p>
      </div>

      {/* Date picker - horizontal scroll */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-darkbg uppercase tracking-wider flex items-center gap-1.5">
          <Icon n="cal" size={14} /> 1. Chọn ngày
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
          {days.map(d => {
            const isSelected = selectedDate === d.iso;
            return (
              <motion.button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDate(d.iso)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 flex flex-col items-center justify-center min-w-[64px] py-3 px-2 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-gradient-to-br from-primary to-[#FF8FAB] text-white shadow-lg scale-105"
                    : "border-gray-100 bg-white hover:border-primary/40"
                }`}
              >
                <span className={`text-[10px] font-extrabold uppercase ${isSelected ? "text-white/80" : "text-muted"}`}>
                  {d.weekday}
                </span>
                <span className={`text-xl font-extrabold mt-0.5 ${isSelected ? "text-white" : "text-darkbg"}`}>
                  {d.day}
                </span>
                {d.isToday && (
                  <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? "text-white/90" : "text-primary"}`}>
                    Hôm nay
                  </span>
                )}
                {d.isTomorrow && (
                  <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? "text-white/90" : "text-amber-500"}`}>
                    Ngày mai
                  </span>
                )}
                {!d.isToday && !d.isTomorrow && (
                  <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? "text-white/80" : d.isWeekend ? "text-rose-400" : "text-muted"}`}>
                    Th{d.month}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
        <div className="text-xs text-muted font-bold">
          Đã chọn: <strong className="text-darkbg">{formatVNDate(selectedDate).full}</strong>
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-darkbg uppercase tracking-wider flex items-center gap-1.5">
          <Icon n="clock" size={14} /> 2. Chọn khung giờ
        </label>
        <div className="space-y-3.5">
          {renderTimeGroup("Buổi sáng", "🌅", TIME_SLOTS_MORNING)}
          {renderTimeGroup("Buổi chiều", "☀️", TIME_SLOTS_AFTERNOON)}
          {renderTimeGroup("Buổi tối", "🌙", TIME_SLOTS_EVENING)}
        </div>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-primary bg-gradient-to-br from-primary to-[#FF8FAB]" />
            Đã chọn
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-gray-200 bg-white" />
            Còn trống
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-gray-100 bg-gray-50" />
            Hết chỗ
          </span>
        </div>
      </div>

      {/* Mode */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-darkbg uppercase tracking-wider flex items-center gap-1.5">
          🏥 3. Hình thức khám
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {APPOINTMENT_MODES.map(m => {
            const isSelected = selectedMode?.id === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                onClick={() => onSelectMode(m)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-gradient-to-br from-primary-light/40 to-white shadow-md"
                    : "border-gray-100 bg-white hover:border-primary/40"
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
                <div className="text-3xl mb-2">{m.emoji}</div>
                <div className="font-extrabold text-sm text-darkbg">{m.label}</div>
                <div className="text-[11px] text-muted font-bold mt-1 leading-tight">{m.description}</div>
                {m.feeMultiplier !== 1 && (
                  <Badge variant={m.feeMultiplier > 1 ? "warning" : "success"} className="mt-2 text-[10px]">
                    {m.feeMultiplier > 1 ? `+${Math.round((m.feeMultiplier - 1) * 100)}%` : `${Math.round((1 - m.feeMultiplier) * 100)}% off`}
                  </Badge>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between pt-3">
        <Button variant="ghost" onClick={onBack}>← Quay lại</Button>
        <Button variant="primary" onClick={onNext} disabled={!canNext} className="px-8">
          Xem lại & xác nhận →
        </Button>
      </div>
    </div>
  );
};

export default StepSchedule;