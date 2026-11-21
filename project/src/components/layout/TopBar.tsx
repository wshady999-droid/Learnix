import { Bell, Menu, Search, LogOut, Settings, User as UserIcon, ChevronDown, X, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationList } from '@/components/ui/NotificationList';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface TopBarProps {
  role: 'admin' | 'teacher' | 'student';
  userName: string;
  onMenuClick: () => void;
  sectionTitle: string;
}

const roleLabel = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };

export function TopBar({ role, userName, onMenuClick, sectionTitle }: TopBarProps) {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { items, markAllRead, dismiss, refresh } = useNotifications(profile?.id);
  const [openPanel, setOpenPanel] = useState<'notifications' | 'profile' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.read).length;
  const initials = (userName || 'U').split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const toggleNotifications = () => {
    if (openPanel === 'notifications') {
      setOpenPanel(null);
      return;
    }
    refresh();
    setOpenPanel('notifications');
  };

  const goToProfile = () => {
    setOpenPanel(null);
    // Admin has no separate profile page yet, so it opens Settings.
    navigate(role === 'admin' ? '/admin/settings' : `/${role}/profile`);
  };

  const goToSettings = () => {
    setOpenPanel(null);
    navigate(`/${role}/settings`);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenPanel(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 backdrop-blur-md sm:px-6"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 88%, transparent)', borderColor: 'var(--border)' }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="btn-ghost p-2 lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="hidden min-w-0 sm:block">
          <p className="text-xs font-medium text-muted">{roleLabel[role]}</p>
          <h2 className="truncate font-display text-base font-semibold text-ink">{sectionTitle}</h2>
        </div>
        <div className="relative ml-2 hidden w-72 md:block">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" placeholder="Search anything..." className="input py-2 pl-10" />
        </div>
      </div>

      <div ref={containerRef} className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="btn-ghost p-2.5 hover:text-primary"
        >
          {theme === 'dark' ? <Sun size={19} className="text-warning" /> : <Moon size={19} />}
        </button>

        <button onClick={toggleNotifications} className="btn-ghost relative p-2.5" aria-label="Notifications">
          <Bell size={19} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>

        <button
          onClick={() => setOpenPanel(openPanel === 'profile' ? null : 'profile')}
          className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-soft"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight text-ink">{userName}</span>
            <span className="block text-xs leading-tight text-muted">{roleLabel[role]}</span>
          </span>
          <ChevronDown size={14} className="hidden text-muted sm:block" />
        </button>

        {openPanel === 'notifications' && (
          <div className="card absolute right-4 top-[4.25rem] z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden py-0 shadow-xl animate-fade-in sm:right-6">
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-display text-sm font-semibold text-ink">Notifications</h3>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button onClick={markAllRead} className="btn-ghost px-2 py-1 text-xs">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpenPanel(null)} className="btn-ghost p-1"><X size={16} /></button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <NotificationList notifications={items} onDismiss={dismiss} />
            </div>
          </div>
        )}

        {openPanel === 'profile' && (
          <div className="card absolute right-4 top-[4.25rem] z-50 w-60 overflow-hidden py-1.5 shadow-xl animate-fade-in sm:right-6">
            <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-semibold text-ink">{userName}</p>
              <p className="text-xs text-muted">{roleLabel[role]} - LearnIx</p>
            </div>
            <button onClick={goToProfile} className="btn-ghost w-full justify-start">
              <UserIcon size={16} /> View profile
            </button>
            <button onClick={goToSettings} className="btn-ghost w-full justify-start">
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}