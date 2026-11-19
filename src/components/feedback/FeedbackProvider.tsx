import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type ToastTone = 'success' | 'error';
type Toast = { id: number; message: string; tone: ToastTone };

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

interface FeedbackValue {
  toast: (message: string, tone?: ToastTone) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const toast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const closeConfirm = (value: boolean) => {
    confirmState?.resolve(value);
    setConfirmState(null);
  };

  useEffect(() => {
    if (!confirmState) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeConfirm(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirmState]);

  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-card"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: item.tone === 'error' ? '#EF4444' : 'var(--border)',
              color: 'var(--text)',
            }}
          >
            {item.message}
          </div>
        ))}
      </div>
      {confirmState && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/50" aria-label="Dismiss" onClick={() => closeConfirm(false)} />
          <div className="card relative z-10 w-full max-w-md p-6" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <h3 id="confirm-title" className="font-display text-base font-semibold text-ink">{confirmState.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{confirmState.message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => closeConfirm(false)}>Cancel</button>
              <button
                type="button"
                className={confirmState.danger ? 'btn-primary bg-danger' : 'btn-primary'}
                onClick={() => closeConfirm(true)}
              >
                {confirmState.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
}
