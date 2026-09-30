import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "@/features/landing/LandingPage";
import LoginPage from "@/features/auth/LoginPage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import PageFallback from "@/components/layout/PageFallback";
import NotFoundPage from "@/components/layout/NotFoundPage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getHomePathByRole } from "@/utils/routing";

// Lazy load các page user để giảm bundle ban đầu
const OverviewPage = lazy(() => import("@/features/overview/OverviewPage"));
const PetProfilePage = lazy(() => import("@/features/pet-profile/PetProfilePage"));
const AiCheckPage = lazy(() => import("@/features/ai-check/AiCheckPage"));
const AiHistoryPage = lazy(() => import("@/features/ai-history/AiHistoryPage"));
const VaccinationPage = lazy(() => import("@/features/vaccination/VaccinationPage"));
const AppointmentPage = lazy(() => import("@/features/appointment/AppointmentPage"));
const AppointmentsPage = lazy(() => import("@/features/appointments-history/AppointmentsPage"));
const CommunityPage = lazy(() => import("@/features/community/CommunityPage"));

// Lazy load các page admin
const AdminOverviewPage = lazy(() => import("@/features/admin/AdminOverviewPage"));
const AdminUsersPage = lazy(() => import("@/features/admin/AdminUsersPage"));
const AdminPostsPage = lazy(() => import("@/features/admin/AdminPostsPage"));
const AdminVaxPage = lazy(() => import("@/features/admin/AdminVaxPage"));
const AdminApptPage = lazy(() => import("@/features/admin/AdminApptPage"));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

/**
 * RootRoute: nếu user đã đăng nhập → redirect Dashboard/Admin theo role.
 * Ngược lại hiển thị LandingPage.
 */
const RootRoute: React.FC = () => {
  const { loggedIn, user } = useAuth();
  if (loggedIn && user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }
  return <LandingPage />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="overview" replace /> },
      { path: "overview", element: withSuspense(OverviewPage) },
      { path: "profile", element: withSuspense(PetProfilePage) },
      { path: "ai", element: withSuspense(AiCheckPage) },
      { path: "ai-history", element: withSuspense(AiHistoryPage) },
      { path: "vax", element: withSuspense(VaccinationPage) },
      { path: "appt", element: withSuspense(AppointmentPage) },
      { path: "appointments", element: withSuspense(AppointmentsPage) },
      { path: "community", element: withSuspense(CommunityPage) },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Navigate to="overview" replace /> },
      { path: "overview", element: withSuspense(AdminOverviewPage) },
      { path: "users", element: withSuspense(AdminUsersPage) },
      { path: "posts", element: withSuspense(AdminPostsPage) },
      { path: "vax", element: withSuspense(AdminVaxPage) },
      { path: "appt", element: withSuspense(AdminApptPage) },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);