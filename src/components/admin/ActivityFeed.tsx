import React from "react";
import { AdminActivity } from "@/data/mock/stats";
import Icon from "@/components/ui/Icon";

const typeConfig: Record<AdminActivity["type"], { color: string; bg: string; label: string }> = {
  create: { color: "text-emerald-600", bg: "bg-emerald-50", label: "Tạo mới" },
  update: { color: "text-indigo-600", bg: "bg-indigo-50", label: "Cập nhật" },
  delete: { color: "text-rose-600", bg: "bg-rose-50", label: "Xóa" },
  alert: { color: "text-amber-600", bg: "bg-amber-50", label: "Cảnh báo" },
};

const iconFor: Record<AdminActivity["type"], string> = {
  create: "tick",
  update: "ai",
  delete: "x",
  alert: "warn",
};

interface ActivityFeedProps {
  items: AdminActivity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => (
  <ul className="divide-y divide-slate-100">
    {items.map(it => {
      const c = typeConfig[it.type];
      return (
        <li key={it.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <div className={`mt-0.5 w-8 h-8 rounded-xl ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>
            <Icon n={iconFor[it.type]} size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-extrabold text-slate-900">{it.actor}</span>{" "}
              <span className="font-semibold">{it.action}</span>{" "}
              <span className="text-slate-500 font-semibold">{it.target}</span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${c.color}`}>{c.label}</span>
              <span className="text-[10px] text-slate-400 font-semibold">· {it.time}</span>
            </div>
          </div>
        </li>
      );
    })}
  </ul>
);

export default ActivityFeed;