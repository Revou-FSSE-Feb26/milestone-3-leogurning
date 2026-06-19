"use client";

import { useEffect, useRef, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

/**
 * Toast – lightweight notification pop-up.
 *
 * Props:
 *  message  {string}  – text to display
 *  type     {string}  – "error" | "success" | "info"  (default: "error")
 *  onClose  {fn}      – called after the toast has faded out
 *  duration {number}  – ms before auto-dismiss (default: 10000)
 */
export default function Toast({
  message,
  type = "error",
  onClose,
  duration = 10000,
}) {
  // Start visible immediately
  const [visible, setVisible] = useState(true);

  // Keep onClose stable
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Auto-dismiss after `duration` ms; only re-run when duration changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // Give the CSS fade-out 300 ms before unmounting
      setTimeout(() => onCloseRef.current?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onCloseRef.current?.(), 300);
  };

  const styles = {
    error: { bg: "bg-red-500", Icon: AlertCircle },
    success: { bg: "bg-green-500", Icon: CheckCircle },
    info: { bg: "bg-blue-500", Icon: Info },
  };

  const { bg, Icon } = styles[type] ?? styles.error;

  return (
    <div
      role="alert"
      aria-live="assertive"
      // Use inline style for opacity/transform and z-index via className keeps it above everything.
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-1rem)",
        transition: "opacity 300ms ease, transform 300ms ease",
        pointerEvents: visible ? "auto" : "none",
      }}
      className={`fixed top-12 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white font-medium max-w-sm w-full ${bg}`}
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
