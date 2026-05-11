import { useEffect, useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  return { toasts, showToast };
}

export default function ToastContainer({ toasts }) {
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-circle-fill',
  };
  const colors = {
    success: 'var(--sage)',
    error: 'var(--terracotta)',
    info: '#3b82f6',
    warning: 'var(--saffron)',
  };

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast show align-items-center mb-2"
          style={{
            background: colors[t.type] || colors.success,
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,.18)',
            animation: 'fadeUp .3s ease',
            minWidth: 260,
          }}
          role="alert"
        >
          <div className="d-flex align-items-center gap-2 p-3">
            <i className={`bi ${icons[t.type] || icons.success} fs-5`}></i>
            <span style={{ fontSize: '.87rem', fontWeight: 500 }}>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
