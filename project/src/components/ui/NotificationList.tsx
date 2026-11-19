import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { Notification } from '@/types';

const icons = {
  info: { Icon: Info, classes: 'bg-primary-soft text-primary' },
  success: { Icon: CheckCircle2, classes: 'bg-success/10 text-success' },
  warning: { Icon: AlertTriangle, classes: 'bg-warning/10 text-warning' },
  error: { Icon: XCircle, classes: 'bg-danger/10 text-danger' },
};

interface NotificationListProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export function NotificationList({ notifications, onDismiss }: NotificationListProps) {
  if (notifications.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-muted">You're all caught up.</p>;
  }
  return (
    <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
      {notifications.map((n) => {
        const { Icon, classes } = icons[n.type];
        return (
          <li
            key={n.id}
            className={`flex gap-3 px-4 py-3 transition-colors hover:bg-soft ${!n.read ? 'bg-primary-soft/50' : ''}`}
            style={{ borderColor: 'var(--border)' }}
          >
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${classes}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{n.title}</p>
              <p className="truncate text-sm text-muted">{n.message}</p>
              <p className="mt-0.5 text-xs text-muted opacity-70">{n.time}</p>
            </div>
            {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            {onDismiss && (
              <button onClick={() => onDismiss(n.id)} className="btn-ghost mt-1 h-6 w-6 p-0">
                <X size={14} className="mx-auto" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
