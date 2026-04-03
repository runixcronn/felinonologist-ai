"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Onayla",
  cancelText = "İptal",
  type = "danger",
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate in
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.fromTo(
        modalRef.current,
        { 
          scale: 0.9, 
          opacity: 0, 
          y: 20 
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          duration: 0.3, 
          ease: "back.out(1.7)" 
        }
      );
    } else {
      // Animate out
      gsap.to(modalRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 10,
        duration: 0.15,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlayRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const typeStyles = {
    danger: {
      icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      button: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      button: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    info: {
      icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 pb-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full ${styles.icon} flex items-center justify-center mb-4`}>
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl ${styles.button} transition-colors shadow-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
