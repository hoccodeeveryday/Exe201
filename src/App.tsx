import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ToastProvider } from "@/app/providers/ToastProvider";
import { AdminDataProvider } from "@/app/providers/AdminDataProvider";
import "@/styles/global.css";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminDataProvider>
          <a href="#main-content" className="skip-link">
            ⌨️ Chuyển đến nội dung chính
          </a>
          <RouterProvider router={router} />
        </AdminDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;