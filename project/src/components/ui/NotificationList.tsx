import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { Notification } from '@/types';

const icons = {
  info: { Icon: Info, classes: 'bg-primary-50 text-primary-600' },
  success: { Icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-600' },
  warning: { Icon: AlertTriangle, classes: 'bg-amber-50 text-amber-600' },
  error: { Icon: XCircle, classes: 'bg-red-50 text-red-600' },
};

interface NotificationListProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export function NotificationList({ notifications, onDismiss }: NotificationListProps) {
  if (notifications.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">You're all caught up.</p>;
  }
  return (
    <ul className="divide-y divide-gray-100">
      {notifications.map((n) => {
        const { Icon, classes } = icons[n.type];
        return (
          <li key={n.id} className={`flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${!n.read ? 'bg-primary-50/40' : ''}`}>
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${classes}`}>
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{n.title}</p>
              <p className="truncate text-sm text-gray-500">{n.message}</p>
              <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
            </div>
            {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
            {onDismiss && (
              <button onClick={() => onDismiss(n.id)} className="mt-1 h-6 w-6 shrink-0 rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <X size={14} className="mx-auto" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
