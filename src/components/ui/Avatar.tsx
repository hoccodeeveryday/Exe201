import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ size = "md", className = "", children, ...props }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-base",
    lg: "w-[60px] h-[60px] text-xl",
  };

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-primary to-[#FF8FAB] flex items-center justify-center text-white font-bold shrink-0 shadow-[0_4px_10px_rgba(240,90,126,0.15)] ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Avatar;
