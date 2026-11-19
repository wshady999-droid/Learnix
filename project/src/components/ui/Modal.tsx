import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-md p-6 shadow-xl animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
