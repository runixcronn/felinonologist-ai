"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert } from "../Alert";

export type AlertType = "success" | "error" | "info" | "warning";

export interface AlertItem {
  id: string;
  message: string;
  type: AlertType;
  duration?: number;
}

interface AlertContextType {
  showAlert: (message: string, type: AlertType, duration?: number) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback(
    (message: string, type: AlertType, duration = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newAlert: AlertItem = { id, message, type, duration };
      setAlerts((prev) => [...prev, newAlert]);

      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, removeAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            message={alert.message}
            type={alert.type}
            onClose={removeAlert}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
