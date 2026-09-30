import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Role } from "@/types";
import { getHomePathByRole } from "@/utils/routing";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Nếu khai báo, route chỉ cho phép các role này. */
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { loggedIn, user } = useAuth();
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Đăng nhập rồi nhưng SAI role (vd admin vào /dashboard) → đẩy về home của role.
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
