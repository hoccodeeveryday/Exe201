import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  msg: string;
  variant?: ToastVariant;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; iconColor: string; textColor: string; iconName: string }
> = {
  success: {
    container: "bg-[#E8F9EE]/90 border-emerald-500/20 border-l-emerald-500 shadow-[0_15px_30px_rgba(16,185,129,0.08)]",
    iconColor: "text-emerald-500",
    textColor: "text-emerald-800",
    iconName: "tick",
  },
  error: {
    container: "bg-[#FEF2F2]/95 border-rose-500/20 border-l-rose-500 shadow-[0_15px_30px_rgba(244,63,94,0.10)]",
    iconColor: "text-rose-500",
    textColor: "text-rose-800",
    iconName: "x",
  },
  warning: {
    container: "bg-[#FFFBEB]/95 border-amber-500/20 border-l-amber-500 shadow-[0_15px_30px_rgba(245,158,11,0.10)]",
    iconColor: "text-amber-500",
    textColor: "text-amber-800",
    iconName: "warn",
  },
  info: {
    container: "bg-[#EFF6FF]/95 border-blue-500/20 border-l-blue-500 shadow-[0_15px_30px_rgba(59,130,246,0.10)]",
    iconColor: "text-blue-500",
    textColor: "text-blue-800",
    iconName: "ai",
  },
};

const Toast: React.FC<ToastProps> = ({ msg, variant = "success" }) => {
  const style = VARIANT_STYLES[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      role="status"
      aria-live="polite"
      className={`fixed bottom-7 right-7 z-50 backdrop-blur-md border border-l-[5px] rounded-2xl px-5 py-4 flex items-center gap-3 min-w-[280px] max-w-md ${style.container}`}
    >
      <Icon n={style.iconName} className={style.iconColor} />
      <span className={`font-semibold text-sm ${style.textColor}`}>{msg}</span>
    </motion.div>
  );
};

export default Toast;