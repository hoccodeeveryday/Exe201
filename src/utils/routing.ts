import { Role } from "@/types";

/**
 * URL mặc định cho mỗi role sau khi đăng nhập / refresh.
 * Dùng ở nhiều nơi: AuthModal, LandingPage, ProtectedRoute...
 */
export const getHomePathByRole = (role: Role | undefined): string => {
  switch (role) {
    case "admin":
      return "/admin/overview";
    case "user":
      return "/dashboard/overview";
    default:
      return "/dashboard/overview";
  }
};

/**
 * Nhãn hiển thị cho CTA theo role.
 */
export const getHomeLabelByRole = (role: Role | undefined): string => {
  switch (role) {
    case "admin":
      return "Mở Admin Panel";
    case "user":
      return "Mở Dashboard";
    default:
      return "Mở Dashboard";
  }
};