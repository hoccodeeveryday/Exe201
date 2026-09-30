import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_-10px_rgba(26,26,46,0.04)] transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
