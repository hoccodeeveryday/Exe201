import React, { createContext, useState, useCallback } from "react";
import Toast, { ToastVariant } from "@/components/ui/Toast";

export interface ToastContextType {
  showToast: (msg: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

const AUTO_DISMISS_MS = 2800;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToast({ id: Date.now(), message, variant });
  }, []);

  const handleDismiss = useCallback(() => {
    setToast(null);
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(handleDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [toast, handleDismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast key={toast.id} msg={toast.message} variant={toast.variant} />}
    </ToastContext.Provider>
  );
};