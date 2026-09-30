import { useContext } from "react";
import { AdminDataContext, AdminDataContextType } from "@/app/providers/AdminDataProvider";

export const useAdminData = (): AdminDataContextType => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
};