import { useCallback, useEffect, useState } from 'react';
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
} from '@/services/notifications';
import type { Notification } from '@/types';

export function useNotifications(userId?: string) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      setItems(await fetchNotifications(userId));
    } catch {
      // keep the previous list if a refresh fails
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 30000);
    return () => clearInterval(timer);
  }, [refresh]);

  const markAllRead = async () => {
    if (!userId) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead(userId);
    } catch {
      refresh();
    }
  };

  const dismiss = async (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch {
      refresh();
    }
  };

  return { items, loading, refresh, markAllRead, dismiss };
}