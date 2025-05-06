import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { Toast } from "./components";
import { Text } from "react-native";
interface ToastContextType {
  showToast: (options: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ShowToastOptions {
  message: ReactNode;
  type?: "success" | "error" | "info";
  title?: string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ShowToastOptions | null>(null);

  const showToast = useCallback((options: ShowToastOptions) => {
    setToast({
      ...options,
      type: options.type || "info",
    });
  }, []);

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
