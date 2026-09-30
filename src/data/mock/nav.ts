import { NavItem } from "@/types";

export const NAV: NavItem[] = [
  { id: "overview", icon: "home", label: "Tổng quan", path: "/dashboard/overview", roles: ["user", "admin"] },
  { id: "profile", icon: "profile", label: "Hồ sơ thú cưng", path: "/dashboard/profile", roles: ["user", "admin"] },
  { id: "ai", icon: "ai", label: "Kiểm tra AI", path: "/dashboard/ai", roles: ["user", "admin"] },
  { id: "ai-history", icon: "clock", label: "Lịch sử AI Check", path: "/dashboard/ai-history", roles: ["user", "admin"] },
  { id: "vax", icon: "vax", label: "Tiêm chủng", path: "/dashboard/vax", roles: ["user", "admin"] },
  { id: "appt", icon: "cal", label: "Đặt lịch khám", path: "/dashboard/appt", roles: ["user", "admin"] },
  { id: "appointments", icon: "clock", label: "Lịch hẹn của tôi", path: "/dashboard/appointments", roles: ["user", "admin"] },
  { id: "community", icon: "community", label: "Cộng đồng", path: "/dashboard/community", roles: ["user", "admin"] },
];

/**
 * Menu riêng cho admin - truy cập /admin/*.
 */
export const ADMIN_NAV: NavItem[] = [
  { id: "admin-overview", icon: "home", label: "Tổng quan hệ thống", path: "/admin/overview", roles: ["admin"] },
  { id: "admin-users", icon: "profile", label: "Quản lý chủ nuôi", path: "/admin/users", roles: ["admin"] },
  { id: "admin-posts", icon: "community", label: "Quản lý bài viết", path: "/admin/posts", roles: ["admin"] },
  { id: "admin-vax", icon: "vax", label: "Quản lý vaccine", path: "/admin/vax", roles: ["admin"] },
  { id: "admin-appt", icon: "cal", label: "Quản lý lịch hẹn", path: "/admin/appt", roles: ["admin"] },
];
