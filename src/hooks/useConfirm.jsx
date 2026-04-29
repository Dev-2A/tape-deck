import { useState, useCallback } from "react";

/**
 * Promise 기반 확인 모달.
 *
 * 사용:
 *   const { confirm, ConfirmDialog } = useConfirm()
 *   const ok = await confirm({ title: '삭제할까요?', body: '...', danger: true })
 *
 *   return <>{ConfirmDialog}{...}</>
 */
export function useConfirm() {
  const [state, setState] = useState(null); // null | { resolve, opts }

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setState({ resolve, opts: opts || {} });
    });
  }, []);

  const handleResolve = (value) => {
    if (state) {
      state.resolve(value);
      setState(null);
    }
  };

  const ConfirmDialog = state ? (
    <ConfirmModal
      opts={state.opts}
      onConfirm={() => handleResolve(true)}
      onCancel={() => handleResolve(false)}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}

function ConfirmModal({ opts, onConfirm, onCancel }) {
  const {
    title = "확인",
    body = "",
    confirmText = "확인",
    cancelText = "취소",
    danger = false,
  } = opts;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backdropFilter: "blur(2px)",
        animation: "fade-in 0.15s ease-out",
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--tape-bg-elevated)",
          border: `1px solid ${danger ? "var(--tape-accent-rust)" : "var(--tape-border)"}`,
          borderRadius: 10,
          padding: 24,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <h3
          className="font-serif"
          style={{
            fontSize: 22,
            color: danger
              ? "var(--tape-accent-rust)"
              : "var(--tape-text-primary)",
            marginBottom: body ? 8 : 16,
          }}
        >
          {title}
        </h3>
        {body && (
          <p
            style={{
              fontSize: 14,
              color: "var(--tape-text-secondary)",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            {body}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid var(--tape-border)",
              backgroundColor: "transparent",
              color: "var(--tape-text-secondary)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: danger
                ? "var(--tape-accent-rust)"
                : "var(--tape-accent-amber)",
              color: "var(--tape-bg-deepest)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
