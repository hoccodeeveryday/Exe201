import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/overview": { title: "Tổng quan hệ thống", subtitle: "Số liệu vận hành thời gian thực" },
  "/admin/users": { title: "Quản lý chủ nuôi", subtitle: "Danh sách, khóa/mở khóa tài khoản" },
  "/admin/posts": { title: "Quản lý bài viết", subtitle: "Kiểm duyệt nội dung cộng đồng" },
  "/admin/vax": { title: "Quản lý vaccine", subtitle: "Theo dõi lịch tiêm chủng toàn hệ thống" },
  "/admin/appt": { title: "Quản lý lịch hẹn", subtitle: "Điều phối lịch khám giữa chủ nuôi và bác sĩ" },
};

const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const meta = TITLES[location.pathname] ?? TITLES["/admin/overview"];

  return (
    <div className="flex min-h-screen bg-admin-shell">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopBar title={meta.title} subtitle={meta.subtitle} onOpenMobileMenu={() => setMobileOpen(true)} />

        <main id="main-content" className="flex-1 px-5 md:px-8 py-6 md:py-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;