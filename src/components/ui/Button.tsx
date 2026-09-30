import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof motion.button>, "children"> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseStyles = "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 flex items-center justify-center gap-2 select-none cursor-pointer disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-[#FF8FAB] text-white shadow-[0_4px_15px_rgba(240,90,126,0.25)] hover:opacity-95 hover:shadow-[0_8px_20px_rgba(240,90,126,0.35)] disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:shadow-none",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary-light disabled:border-gray-200 disabled:text-gray-400",
    ghost: "text-muted hover:bg-gray-100 hover:text-darkbg rounded-xl px-4 py-2",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
