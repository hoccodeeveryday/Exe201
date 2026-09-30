import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Sparkline from "@/components/charts/Sparkline";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  delta: number; // phần trăm
  sparklineData: number[];
  icon: string;
  iconGradient: string; // dạng "from-indigo-500 to-purple-500"
  accentColor: string; // màu sparkline
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  delta,
  sparklineData,
  icon,
  iconGradient,
  accentColor,
}) => {
  const positive = delta >= 0;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-admin rounded-2xl p-5 admin-tile shadow-admin relative overflow-hidden"
    >
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15 blur-2xl bg-gradient-to-br ${iconGradient}`} />

      <div className="flex items-start justify-between mb-4 relative">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
          {label}
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-md`}>
          <Icon n={icon} size={18} color="#fff" />
        </div>
      </div>

      <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>

      <div className="flex items-end justify-between mt-3 relative">
        <div className={`flex items-center gap-1 text-xs font-bold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          <span>{positive ? "▲" : "▼"}</span>
          <span>{Math.abs(delta).toFixed(1)}%</span>
          <span className="text-slate-400 font-semibold ml-1">vs tháng trước</span>
        </div>
        <div className="-mb-1 -mr-1">
          <Sparkline data={sparklineData} width={84} height={32} stroke={accentColor} fill={`${accentColor}30`} />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStatCard;