import React, { useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  ariaLabel?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal: React.FC<ModalProps> = ({ isOpen = true, onClose, children, width = 480, ariaLabel }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Đóng modal khi ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && cardRef.current) {
        // Focus trap
        const focusables = Array.from(
          cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lưu element focus trước đó + auto-focus vào modal
  useEffect(() => {
    if (isOpen) {
      previousActiveRef.current = document.activeElement as HTMLElement | null;
      // Focus first focusable trong modal
      setTimeout(() => {
        if (!cardRef.current) return;
        const first = cardRef.current.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
      }, 50);
      // Khóa scroll body
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        previousActiveRef.current?.focus?.();
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabel ? undefined : titleId}
          aria-label={ariaLabel}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-darkbg/50 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            ref={cardRef}
            id={ariaLabel ? undefined : titleId}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{ width, maxWidth: "95vw" }}
            className="relative bg-white rounded-3xl p-8 border border-white/40 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;