import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "./components";
import { ShowToastOptions } from "./types";
import { useTranslation } from "react-i18next";

interface ToastContextType {
  showToast: (options: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [toast, setToast] = useState<ShowToastOptions | null>(null);

  const showToast = useCallback(
    (options: ShowToastOptions) => {
      setToast({
        ...options,
        type: options.type || "info",
        title: t(options.title || ""),
      });
    },
    [t]
  );

  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          title={toast.title}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
