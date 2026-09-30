import React from "react";
import Icon from "@/components/ui/Icon";

interface StepBarProps {
  steps: string[];
  currentStep: number;
  /**
   * Click vào step đã qua (hoặc step hiện tại) sẽ navigate tới step đó.
   * Step tương lai (chưa tới) sẽ bị disable.
   * Nếu undefined: chỉ hiển thị.
   */
  onStepClick?: (step: number) => void;
}

const StepBar: React.FC<StepBarProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center gap-0 mb-8 select-none">
      {steps.map((s, i) => {
        const stepNumber = i + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const canClick = onStepClick && stepNumber <= currentStep;

        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                disabled={!canClick}
                onClick={() => canClick && onStepClick(stepNumber)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 outline-none
                  ${isDone 
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/10" 
                    : isActive 
                      ? "bg-gradient-to-r from-primary to-[#FF8FAB] text-white shadow-lg shadow-primary/10 ring-4 ring-primary/10" 
                      : "bg-white text-gray-400 border-2 border-gray-200"}
                  ${canClick ? "cursor-pointer hover:scale-110 active:scale-95" : ""}`}
                aria-label={`Bước ${stepNumber}: ${s}`}
              >
                {isDone ? <Icon n="tick" size={14} color="#fff" /> : stepNumber}
              </button>
              <span className={`text-[11px] mt-2 font-bold tracking-tight text-center px-1 ${isActive ? "text-primary" : "text-gray-400"}`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 px-1 -mt-5">
                <div
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    isDone ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepBar;
