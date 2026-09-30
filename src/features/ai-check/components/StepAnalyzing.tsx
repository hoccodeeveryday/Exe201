import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepAnalyzingProps {
  onComplete: () => void;
}

interface AnalyzeStep {
  emoji: string;
  text: string;
  duration: number; // ms
}

const STEPS: AnalyzeStep[] = [
  { emoji: "📖", text: "Đang đọc triệu chứng...", duration: 900 },
  { emoji: "🧠", text: "So sánh với 12.000+ bệnh án...", duration: 1000 },
  { emoji: "🔬", text: "Phân tích hình ảnh (nếu có)...", duration: 800 },
  { emoji: "📊", text: "Đánh giá mức độ rủi ro...", duration: 700 },
  { emoji: "💡", text: "Đang tạo khuyến nghị...", duration: 600 },
];

const StepAnalyzing: React.FC<StepAnalyzingProps> = ({ onComplete }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stepIdx >= STEPS.length) {
      onComplete();
      return;
    }
    const step = STEPS[stepIdx];
    const startTime = Date.now();

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / step.duration) * 100, 100);
      setProgress(pct);
    }, 50);

    const stepTimer = setTimeout(() => {
      setStepIdx(prev => prev + 1);
      setProgress(0);
    }, step.duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [stepIdx, onComplete]);

  const currentStep = STEPS[stepIdx];
  const totalProgress = ((stepIdx + progress / 100) / STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-8 select-none min-h-[480px]">
      {/* Brain animation */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-rose-400 to-pink-500 flex items-center justify-center text-6xl shadow-2xl ring-8 ring-primary/10"
        >
          🧠
        </motion.div>
        {/* Orbiting dots */}
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <span
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-72px)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-base font-extrabold text-darkbg">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-2xl"
            >
              {currentStep?.emoji ?? "✨"}
            </motion.span>
            {currentStep?.text ?? "Hoàn tất!"}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-sm space-y-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-rose-400 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted font-bold uppercase tracking-wider">
          <span>Bước {Math.min(stepIdx + 1, STEPS.length)} / {STEPS.length}</span>
          <span>{Math.round(totalProgress)}%</span>
        </div>
      </div>

      {/* Steps checklist */}
      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((s, i) => {
          const isDone = i < stepIdx;
          const isCurrent = i === stepIdx;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isDone
                  ? "bg-emerald-50 text-emerald-700"
                  : isCurrent
                    ? "bg-primary-light text-primary"
                    : "bg-gray-50 text-muted"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-muted"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span className="text-sm">{s.emoji}</span>
              <span>{s.text.replace("...", "")}</span>
              {isCurrent && (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-auto"
                >
                  ●●●
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer disclaimer */}
      <div className="text-[10px] text-muted italic text-center max-w-md px-4 pt-3 border-t border-gray-100">
        🤖 Kết quả AI chỉ mang tính tham khảo. Luôn tham vấn bác sĩ thú y để có chẩn đoán chính xác.
      </div>
    </div>
  );
};

export default StepAnalyzing;