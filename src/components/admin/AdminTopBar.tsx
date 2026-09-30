import React from "react";
import Icon from "@/components/ui/Icon";

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ title, subtitle, onOpenMobileMenu, actions }) => {
  return (
    <div className="sticky top-0 z-30 glass-admin shadow-admin border-b border-slate-200/60">
      <div className="px-5 md:px-8 py-3.5 flex items-center gap-4">
        <button
          type="button"
          aria-label="Mở menu"
          onClick={onOpenMobileMenu}
          className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
        >
          ☰
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-extrabold text-slate-900 truncate">{title}</h1>
          {subtitle && (
            <div className="hidden md:block text-xs text-slate-500 font-semibold mt-0.5 truncate">{subtitle}</div>
          )}
        </div>

        {/* Search */}
        <div className="hidden lg:block relative w-72">
          <Icon n="ai" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Tìm trong admin..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
          />
        </div>

        {/* Notification */}
        <button
          className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
          aria-label="Thông báo"
        >
          <Icon n="community" size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {actions}
      </div>
    </div>
  );
};

export default AdminTopBar;