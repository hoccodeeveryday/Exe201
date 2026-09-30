import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { NAV, ADMIN_NAV } from "@/data/mock/nav";

interface SidebarProps {
  variant?: "user" | "admin";
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ variant = "user", mobileOpen = false, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menu = variant === "admin" ? ADMIN_NAV : NAV;

  const handleNavigate = (path: string) => {
    navigate(path);
    onCloseMobile?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    onCloseMobile?.();
  };

  const asideClasses =
    "fixed md:sticky inset-y-0 md:top-0 left-0 z-50 md:z-auto w-64 bg-white/90 backdrop-blur-xl border-r border-gray-100 flex flex-col justify-between p-6 select-none shrink-0 h-screen transform transition-transform duration-300";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex ${asideClasses}`} aria-label="Menu chính">
        <SidebarContent
          variant={variant}
          menu={menu}
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          userName={user?.name}
          userRole={user?.role}
        />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`md:hidden ${asideClasses} shadow-2xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Menu chính"
      >
        <SidebarContent
          variant={variant}
          menu={menu}
          currentPath={location.pathname}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onCloseMobile={onCloseMobile}
          userName={user?.name}
          userRole={user?.role}
        />
      </aside>
    </>
  );
};

interface SidebarContentProps {
  variant: "user" | "admin";
  menu: typeof NAV;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onCloseMobile?: () => void;
  userName?: string;
  userRole?: "admin" | "user";
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  variant,
  menu,
  currentPath,
  onNavigate,
  onLogout,
  onCloseMobile,
  userName,
  userRole,
}) => {
  const isAdmin = variant === "admin";

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-2 px-2">
          <span className="text-2xl drop-shadow-sm">{isAdmin ? "🛡️" : "🐾"}</span>
          <span className="font-extrabold text-xl text-primary">VetGen</span>
          {onCloseMobile && (
            <button
              type="button"
              aria-label="Đóng menu"
              onClick={onCloseMobile}
              className="ml-auto w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-muted cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        {isAdmin && (
          <div className="px-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Admin Panel
            </span>
          </div>
        )}
        {!isAdmin && <div className="mb-6" />}

        <nav className="flex flex-col gap-1">
          {menu.map(m => {
            const isActive = currentPath === m.path;
            return (
              <button
                key={m.id}
                onClick={() => onNavigate(m.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left relative outline-none
                  ${isActive
                    ? isAdmin
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 font-bold shadow-sm"
                      : "bg-primary-light text-primary font-bold"
                    : "text-muted hover:bg-primary-mid hover:text-primary"}`}
              >
                {isActive && (
                  <span
                    className={`absolute left-0 top-[20%] h-[60%] w-1 rounded-r-md ${
                      isAdmin ? "bg-gradient-to-b from-amber-400 to-orange-500" : "bg-primary"
                    }`}
                  />
                )}
                <Icon
                  n={m.icon}
                  size={18}
                  className={isActive ? (isAdmin ? "text-orange-600" : "text-primary") : "text-muted"}
                />
                {m.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2">
        {userName && (
          <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs font-bold text-darkbg truncate">{userName}</div>
            <div className="text-[10px] uppercase font-bold text-muted mt-0.5">
              {userRole === "admin" ? "Quản trị viên" : "Chủ nuôi"}
            </div>
          </div>
        )}
        {userRole === "admin" && !isAdmin && (
          <button
            onClick={() => onNavigate("/admin/overview")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 cursor-pointer text-left transition-all duration-200 outline-none border border-indigo-100"
          >
            <Icon n="home" size={16} className="text-indigo-600" />
            🛡️ Mở Admin Panel
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer text-left transition-colors duration-200 outline-none"
        >
          <Icon n="x" size={16} className="text-rose-600" />
          Đăng xuất
        </button>
      </div>
    </>
  );
};

export default Sidebar;
