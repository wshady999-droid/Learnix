import { PageHeader } from '@/components/ui/PageHeader';
import { NotificationList } from '@/components/ui/NotificationList';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

export default function StudentNotifications() {
  const { profile } = useAuth();
  const { items, loading, markAllRead, dismiss } = useNotifications(profile?.id);

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={loading ? 'Loading...' : `${items.filter((n) => !n.read).length} unread.`}
        actions={
          <button className="btn-secondary" onClick={markAllRead}>
            Mark all read
          </button>
        }
      />
      <div className="card overflow-hidden">
        <NotificationList notifications={items} onDismiss={dismiss} />
      </div>
    </>
  );
}