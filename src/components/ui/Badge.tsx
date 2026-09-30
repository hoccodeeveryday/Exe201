import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info";
}

const Badge: React.FC<BadgeProps> = ({ variant = "success", className = "", children, ...props }) => {
  const variants = {
    success: "bg-emerald-50 text-[#10B981] border-emerald-100",
    warning: "bg-amber-50 text-warning border-amber-100",
    danger: "bg-rose-50 text-danger border-rose-100",
    info: "bg-violet-50 text-violet-700 border-violet-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
