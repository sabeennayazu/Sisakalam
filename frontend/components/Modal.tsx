"use client";

import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
  ariaLabel?: string;
  closeButtonClassName?: string;
}

/**
 * Reusable Modal component.
 * 
 * Props:
 * - open: boolean - Controls the visibility of the modal.
 * - onClose: () => void - Callback function to close the modal.
 * - children: ReactNode - Content to be displayed inside the modal.
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  contentClassName,
  ariaLabel,
  closeButtonClassName,
}) => {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className={contentClassName ?? "relative w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-300"}
        onClick={(e) => e.stopPropagation()}
        aria-label={ariaLabel}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
      >
        <button
          type="button"
          onClick={onClose}
          className={closeButtonClassName ?? "absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
