"use client";

import { useEffect, useRef } from "react";
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import gsap from "gsap";
import { AlertType } from "@/app/components/providers/AlertProvider";

interface AlertProps {
  id: string;
  message: string;
  type: AlertType;
  onClose: (id: string) => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    iconColor: "text-green-500",
    progressColor: "bg-green-500",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    iconColor: "text-red-500",
    progressColor: "bg-red-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-500",
    progressColor: "bg-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-500",
    progressColor: "bg-orange-500",
  },
};

export function Alert({ id, message, type, onClose }: AlertProps) {
  const alertRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide in animation
      gsap.fromTo(
        alertRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );

      // Progress bar animation
      gsap.fromTo(
        progressRef.current,
        { scaleX: 1 },
        { scaleX: 0, duration: 5, ease: "linear" }
      );
    }, alertRef);

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(alertRef.current, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => onClose(id),
    });
  };

  return (
    <div
      ref={alertRef}
      className={`relative overflow-hidden rounded-xl border ${config.bgColor} ${config.borderColor} backdrop-blur-xl shadow-lg min-w-[300px] max-w-[400px]`}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 shrink-0 ${config.iconColor} mt-0.5`} />
        <p className="text-sm text-foreground flex-1">{message}</p>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
        >
          <X className="w-4 h-4 text-muted" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border/50">
        <div
          ref={progressRef}
          className={`h-full ${config.progressColor} origin-left`}
        />
      </div>
    </div>
  );
}
