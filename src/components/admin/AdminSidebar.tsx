import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ADMIN_NAV } from "@/data/mock/nav";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    onCloseMobile?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    onCloseMobile?.();
  };

  const sidebarInner = (
    <div className="h-full flex flex-col bg-admin-sidebar text-admin-text sidebar-scroll overflow-y-auto">
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-lg">V</span>
          </div>
          <div>
            <div className="text-white font-extrabold text-base leading-tight">VetGen Admin</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Control Panel</div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={onCloseMobile}
              className="ml-auto w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-admin-text-muted cursor-pointer md:hidden"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-6" aria-label="Quản trị menu">
        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-admin-text-muted/70">
            Tổng quan
          </div>
          <div className="space-y-1">
            {ADMIN_NAV.slice(0, 1).map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  className={`admin-nav-item w-full text-left ${active ? "active" : ""}`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <Icon n={item.icon} size={17} className={active ? "text-white" : ""} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-admin-text-muted/70">
            Quản lý
          </div>
          <div className="space-y-1">
            {ADMIN_NAV.slice(1).map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  className={`admin-nav-item w-full text-left ${active ? "active" : ""}`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <Icon n={item.icon} size={17} className={active ? "text-white" : ""} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-admin-text-muted/70">
            Công cụ
          </div>
          <div className="space-y-1">
            <button className="admin-nav-item w-full text-left opacity-70 cursor-default">
              <Icon n="ai" size={17} />
              Cấu hình AI
            </button>
            <button className="admin-nav-item w-full text-left opacity-70 cursor-default">
              <Icon n="profile" size={17} />
              Phân quyền
            </button>
            <button className="admin-nav-item w-full text-left opacity-70 cursor-default">
              <Icon n="home" size={17} />
              Nhật ký hệ thống
            </button>
          </div>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-white/5 space-y-2">
        {user?.name && (
          <div className="px-3 py-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white">
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-extrabold text-white truncate">{user.name}</div>
                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Administrator</div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-rose-300 hover:!bg-rose-500/10 hover:!text-rose-200"
        >
          <Icon n="x" size={17} />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 sticky top-0 h-screen" aria-label="Admin menu">
        {sidebarInner}
      </aside>
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Admin menu"
      >
        {sidebarInner}
      </aside>
    </>
  );
};

export default AdminSidebar;