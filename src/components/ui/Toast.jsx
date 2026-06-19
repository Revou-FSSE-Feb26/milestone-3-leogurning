"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

/**
 * Toast – lightweight notification pop-up.
 *
 * Props:
 *  message  {string}  – text to display
 *  type     {string}  – "error" | "success" | "info"  (default: "error")
 *  onClose  {fn}      – called when the toast is dismissed
 *  duration {number}  – ms before auto-dismiss (default: 4000)
 */
export default function Toast({
  message,
  type = "error",
  onClose,
  duration = 4000,
}) {
  const [visible, setVisible] = useState(false);

  // Small delay so the CSS transition actually fires on mount
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => handleClose(), duration);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    // Wait for fade-out transition before unmounting
    setTimeout(() => onClose?.(), 300);
  };

  const styles = {
    error: {
      bg: "bg-red-500",
      Icon: AlertCircle,
    },
    success: {
      bg: "bg-green-500",
      Icon: CheckCircle,
    },
    info: {
      bg: "bg-blue-500",
      Icon: Info,
    },
  };

  const { bg, Icon } = styles[type] ?? styles.error;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl
        text-white font-medium max-w-sm w-full
        transition-all duration-300 ease-in-out
        ${bg}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      <button
        onClick={handleClose}
        aria-label="Close notification"
        className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
