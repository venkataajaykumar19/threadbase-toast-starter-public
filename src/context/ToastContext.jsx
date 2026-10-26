import { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "../components/ToastContainer.jsx";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  // The list of active toasts. Each toast is { id, message, type, duration }.
  const [toasts, setToasts] = useState([]);

  // dismissToast removes the toast whose id matches, using setToasts + filter
  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  // showToast generates an id, appends the toast using updater form, and schedules auto-dismiss
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type, duration }]);
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// useToast lets any component grab showToast / dismissToast without prop drilling.
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
}
