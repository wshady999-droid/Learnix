import { useLocation, useNavigate } from 'react-router-dom';
import {
  X, LogOut, LayoutDashboard, Users, BookOpen, Tags, BarChart3, Settings,
  FilePlus2, PlayCircle, ClipboardList, FileText, TrendingUp, Award, Sparkles, Bell, User,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { isItemActive, type NavItem } from './navigation';
import { useSession } from '@/store/session';
import type { Role } from '@/types';

const icons: Record<string, React.ComponentType<{ size?: number | string }>> = {
  LayoutDashboard, Users, BookOpen, Tags, BarChart3, Settings, FilePlus2, PlayCircle,
  ClipboardList, FileText, TrendingUp, Award, Sparkles, Bell, User,
};

interface SidebarProps {
  items: NavItem[];
  role: Role;
  open: boolean;
  onClose: () => void;
}

const roleTag: Record<Role, string> = {
  admin: 'Administration',
  teacher: 'Teaching',
  student: 'Learning',
};

export function Sidebar({ items, role, open, onClose }: SidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useSession();

  const leave = () => {
    signOut();
    navigate('/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-200 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button type="button" onClick={onClose} className="btn-ghost p-2 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted">{roleTag[role]}</p>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {items.map((item) => {
            const Icon = icons[item.icon] ?? BookOpen;
            const active = isItemActive(pathname, item);
            return (
              <a
                key={item.to}
                href={item.to}
                onClick={(event) => {
                  event.preventDefault();
                  onClose();
                  navigate(item.to);
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  active ? 'bg-primary text-white' : 'text-muted hover:bg-soft hover:text-ink'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
          <button type="button" onClick={leave} className="btn-ghost w-full justify-start">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
