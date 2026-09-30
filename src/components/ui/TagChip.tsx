import React from "react";

interface TagChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const TagChip: React.FC<TagChipProps> = ({ selected = false, className = "", children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-full text-xs font-semibold border cursor-pointer select-none transition-all duration-200 
        ${selected 
          ? "bg-gradient-to-r from-primary to-[#FF8FAB] text-white border-transparent shadow-[0_4px_10px_rgba(240,90,126,0.15)]" 
          : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-mid hover:-translate-y-0.5"} 
        ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default TagChip;
