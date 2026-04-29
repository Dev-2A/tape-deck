import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { uuid } from "../utils/uuid";

const ToastContext = createContext(null);

/**
 * 전역 토스트 알림 시스템.
 *
 * 사용:
 *   const toast = useToast()
 *   toast.success('저장됐어요')
 *   toast.error('실패했어요')
 *   toast.info('가져오는 중...')
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((arr) => arr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, text, opts = {}) => {
      const id = uuid();
      const duration = opts.duration ?? 3000;
      setToasts((arr) => [...arr, { id, type, text }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = {
    success: (t, o) => show("success", t, o),
    error: (t, o) => show("error", t, o),
    info: (t, o) => show("info", t, o),
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/**
 * 화면 우하단 토스트 스택.
 */
function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const colors = {
    success: {
      bg: "#1f1a14",
      border: "var(--tape-accent-moss)",
      icon: "✓",
      fg: "var(--tape-accent-moss)",
    },
    error: {
      bg: "#1f1a14",
      border: "var(--tape-accent-rust)",
      icon: "✕",
      fg: "var(--tape-accent-rust)",
    },
    info: {
      bg: "#1f1a14",
      border: "var(--tape-accent-blue)",
      icon: "ℹ",
      fg: "var(--tape-accent-blue)",
    },
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div
      style={{
        pointerEvents: "auto",
        backgroundColor: c.bg,
        borderLeft: `3px solid ${c.border}`,
        borderRadius: 6,
        padding: "12px 14px",
        minWidth: 240,
        maxWidth: 360,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      <span
        style={{ color: c.fg, fontWeight: 700, fontSize: 14, flexShrink: 0 }}
      >
        {c.icon}
      </span>
      <p
        style={{
          flex: 1,
          fontSize: 13,
          color: "var(--tape-text-primary)",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {toast.text}
      </p>
      <button
        onClick={onClose}
        style={{
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          color: "var(--tape-text-muted)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 4px",
          flexShrink: 0,
        }}
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
