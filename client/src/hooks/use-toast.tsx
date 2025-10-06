import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({
  toast: (options) => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((options) => {
    setToasts((prev) => [...prev, { ...options, id: Math.random().toString(36) }]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, options.duration || 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ background: '#f87171', color: 'white', padding: 12, borderRadius: 8, marginBottom: 8, minWidth: 200 }}>
            <strong>{t.title}</strong>
            <div>{t.description}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
