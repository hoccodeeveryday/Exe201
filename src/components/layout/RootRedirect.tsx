import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getHomePathByRole } from "@/utils/routing";

/**
 * Redirect root path đến trang phù hợp với role:
 * - Có user → home page của role (admin → /admin, user → /dashboard)
 * - Chưa login → landing page
 *
 * Hiện dùng đơn giản: chỉ cho phép AuthModal xử lý điều hướng sau login.
 * Component này giữ lại nếu cần nâng cấp về sau.
 */
const RootRedirect: React.FC = () => {
  const { loggedIn, user } = useAuth();
  if (loggedIn && user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }
  return <Navigate to="/" replace />;
};

export default RootRedirect;
