import { Bell, Menu, Search, LogOut, Settings, User as UserIcon, ChevronDown, Sun, Moon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useSession } from '@/store/session';
import { useCatalog } from '@/store/catalog';
import type { NavItem } from './navigation';
import type { Role } from '@/types';

interface TopBarProps {
  items: NavItem[];
  role: Role;
  userName: string;
  onMenuClick: () => void;
  sectionTitle: string;
}

const roleLabel = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };

interface Hit {
  label: string;
  detail: string;
  to: string;
}

export function TopBar({ items, role, userName, onMenuClick, sectionTitle }: TopBarProps) {
  const navigate = useNavigate();
  const { signOut } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { users, courses, quizzes, assignments, notifications, markNotificationRead } = useCatalog();
  const [openPanel, setOpenPanel] = useState<'notifications' | 'profile' | null>(null);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((item) => !item.read).length;

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const found: Hit[] = [];
    items.forEach((item) => {
      if (item.label.toLowerCase().includes(q)) found.push({ label: item.label, detail: 'Page', to: item.to });
    });
    if (role === 'admin') {
      users.forEach((user) => {
        if (user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)) {
          found.push({ label: user.name, detail: user.role, to: `/admin/users/${user.id}` });
        }
      });
    }
    const courseBase = role === 'admin' ? '/admin/courses' : role === 'teacher' ? '/teacher/courses' : '/student/courses';
    courses.forEach((course) => {
      if (course.title.toLowerCase().includes(q) || course.instructor.toLowerCase().includes(q)) {
        found.push({ label: course.title, detail: course.category, to: `${courseBase}/${course.id}` });
      }
    });
    if (role !== 'admin') {
      quizzes.forEach((quiz) => {
        if (quiz.title.toLowerCase().includes(q)) {
          found.push({
            label: quiz.title,
            detail: 'Quiz',
            to: role === 'teacher' ? '/teacher/quizzes' : `/student/quizzes/${quiz.id}`,
          });
        }
      });
      assignments.forEach((assignment) => {
        if (assignment.title.toLowerCase().includes(q)) {
          found.push({
            label: assignment.title,
            detail: 'Assignment',
            to: role === 'teacher' ? '/teacher/assignments' : `/student/assignments/${assignment.id}`,
          });
        }
      });
    }
    return found.slice(0, 8);
  }, [assignments, courses, items, query, quizzes, role, users]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpenPanel(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = (to: string) => {
    setQuery('');
    setOpenPanel(null);
    navigate(to);
  };

  const signOutNow = () => {
    signOut();
    navigate('/login');
  };

  const searchField = (id: string) => (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && hits[0]) go(hits[0].to);
          if (event.key === 'Escape') setQuery('');
        }}
        placeholder="Search pages and records"
        className="input py-2 pl-9"
      />
      {query.trim() && (
        <div className="card absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden py-1 shadow-card">
          {hits.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted">No matches.</p>
          ) : hits.map((hit) => (
            <button
              key={`${hit.to}-${hit.label}`}
              type="button"
              onClick={() => go(hit.to)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-soft"
            >
              <span className="truncate font-medium text-ink">{hit.label}</span>
              <span className="shrink-0 text-xs capitalize text-muted">{hit.detail}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-30 border-b px-4 sm:px-6"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 92%, transparent)', borderColor: 'var(--border)' }}
    >
      <div className="flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onMenuClick} className="btn-ghost p-2 lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-xs text-muted">{roleLabel[role]}</p>
            <h2 className="truncate text-sm font-semibold text-ink">{sectionTitle}</h2>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 md:block md:max-w-sm">
          {searchField('global-search')}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost p-2.5"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === 'notifications' ? null : 'notifications')}
            className="btn-ghost relative p-2.5"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === 'profile' ? null : 'profile')}
            className="flex items-center gap-2 rounded-lg p-1.5 pr-2 hover:bg-soft"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {userName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-ink">{userName}</span>
              <span className="block text-xs leading-tight text-muted">{roleLabel[role]}</span>
            </span>
            <ChevronDown size={14} className="hidden text-muted sm:block" />
          </button>
        </div>
      </div>

      <div className="pb-3 md:hidden">{searchField('global-search-mobile')}</div>

      {openPanel === 'notifications' && (
        <div className="card absolute right-4 top-16 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden py-0 sm:right-6">
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold text-ink">Notifications</h3>
            {role === 'student' && (
              <button type="button" className="text-xs font-medium text-primary" onClick={() => go('/student/notifications')}>View all</button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No notifications.</li>}
            {notifications.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => markNotificationRead(item.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-soft ${item.read ? '' : 'bg-primary-soft/40'}`}
                >
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="truncate text-sm text-muted">{item.message}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {openPanel === 'profile' && (
        <div className="card absolute right-4 top-16 z-50 w-64 overflow-hidden py-1 sm:right-6">
          <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold text-ink">{userName}</p>
            <p className="text-xs text-muted">{roleLabel[role]}</p>
          </div>
          {role === 'student' && (
            <button type="button" onClick={() => go('/student/profile')} className="btn-ghost w-full justify-start">
              <UserIcon size={16} /> Profile
            </button>
          )}
          {role === 'admin' && (
            <button type="button" onClick={() => go('/admin/settings')} className="btn-ghost w-full justify-start">
              <Settings size={16} /> Settings
            </button>
          )}
          {role === 'teacher' && (
            <p className="px-4 py-3 text-xs leading-relaxed text-muted">Platform settings are managed by an administrator.</p>
          )}
          <button type="button" onClick={signOutNow} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger/10">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </header>
  );
}
