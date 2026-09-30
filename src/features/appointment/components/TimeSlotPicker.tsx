import React from "react";
import Button from "@/components/ui/Button";

const TIME_SLOTS = [
  { time: "08:00", available: true },
  { time: "09:00", available: false },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:00", available: true },
];

interface TimeSlotPickerProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  onSelectTime,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-lg text-darkbg">Chọn thời gian đặt lịch</h2>
        <p className="text-muted text-sm mt-1">Chọn ngày khám và khung giờ còn trống bên dưới.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-darkbg uppercase tracking-wide mb-2">
            Chọn ngày khám
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-darkbg bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-darkbg uppercase tracking-wide mb-2.5">
            Chọn khung giờ
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map(t => {
              const isSelected = selectedTime === t.time;
              return (
                <button
                  key={t.time}
                  type="button"
                  disabled={!t.available}
                  onClick={() => onSelectTime(t.time)}
                  className={`px-3 py-2.5 rounded-full text-xs font-semibold border cursor-pointer select-none transition-all duration-200 outline-none
                    ${!t.available 
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" 
                      : isSelected 
                        ? "bg-gradient-to-r from-primary to-[#FF8FAB] text-white border-transparent shadow-[0_4px_10px_rgba(240,90,126,0.15)] font-bold" 
                        : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"}`}
                >
                  {t.time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-3">
        <Button variant="ghost" onClick={onBack}>← Quay lại</Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!selectedTime}
          className="px-8"
        >
          Tiếp tục →
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
