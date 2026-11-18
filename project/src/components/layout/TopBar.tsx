import { Bell, Menu, Search, LogOut, Settings, User as UserIcon, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications as seedNotifications } from '@/services/mockData';
import type { Notification } from '@/types';
import { NotificationList } from '@/components/ui/NotificationList';

interface TopBarProps {
  role: 'admin' | 'teacher' | 'student';
  userName: string;
  onMenuClick: () => void;
  sectionTitle: string;
}

const roleLabel = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };

export function TopBar({ role, userName, onMenuClick, sectionTitle }: TopBarProps) {
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState<'notifications' | 'profile' | null>(null);
  const [items, setItems] = useState<Notification[]>(seedNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenPanel(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="hidden min-w-0 sm:block">
          <p className="text-xs font-medium text-gray-400">{roleLabel[role]}</p>
          <h2 className="truncate font-display text-base font-semibold text-ink">{sectionTitle}</h2>
        </div>
        <div className="relative ml-2 hidden w-72 md:block">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search anything..." className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-primary-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100" />
        </div>
      </div>

      <div ref={containerRef} className="flex items-center gap-2">
        <button
          onClick={() => setOpenPanel(openPanel === 'notifications' ? null : 'notifications')}
          className="relative rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={19} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        <button
          onClick={() => setOpenPanel(openPanel === 'profile' ? null : 'profile')}
          className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-gray-100"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary text-sm font-bold text-white">
            {userName.split(' ').map((p) => p[0]).join('')}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink">{userName}</span>
            <span className="block text-xs leading-tight text-gray-400">{roleLabel[role]}</span>
          </span>
          <ChevronDown size={14} className="hidden text-gray-400 sm:block" />
        </button>

        {openPanel === 'notifications' && (
          <div className="absolute right-4 top-[4.25rem] z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-fade-in sm:right-6">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="font-display text-sm font-semibold text-ink">Notifications</h3>
              <button onClick={() => setOpenPanel(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"><X size={16} /></button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <NotificationList notifications={items} onDismiss={(id) => setItems(items.filter((n) => n.id !== id))} />
            </div>
          </div>
        )}

        {openPanel === 'profile' && (
          <div className="absolute right-4 top-[4.25rem] z-50 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl animate-fade-in sm:right-6">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink">{userName}</p>
              <p className="text-xs text-gray-400">{roleLabel[role]} · BrainUp</p>
            </div>
            <button onClick={() => setOpenPanel(null)} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
              <UserIcon size={16} /> View profile
            </button>
            <button onClick={() => setOpenPanel(null)} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
