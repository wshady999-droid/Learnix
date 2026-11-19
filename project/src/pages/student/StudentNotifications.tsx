import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { NotificationList } from '@/components/ui/NotificationList';
import { notifications as seed } from '@/services/mockData';
import type { Notification } from '@/types';

export default function StudentNotifications() {
  const [items, setItems] = useState<Notification[]>(seed);

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={`${items.filter((n) => !n.read).length} unread.`}
        actions={
          <button className="btn-secondary" onClick={() => setItems(items.map((n) => ({ ...n, read: true })))}>
            Mark all read
          </button>
        }
      />
      <div className="card overflow-hidden">
        <NotificationList notifications={items} onDismiss={(id) => setItems(items.filter((n) => n.id !== id))} />
      </div>
    </>
  );
}
