import { NavLink } from 'react-router-dom';
import {
  X, LogOut, GraduationCap, LayoutDashboard, Users, BookOpen, Tags, BarChart3, Settings,
  FilePlus2, PlayCircle, ClipboardList, FileText, TrendingUp, Award, Sparkles,
} from 'lucide-react';
import type { NavItem } from './navigation';

const icons: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  LayoutDashboard, Users, BookOpen, Tags, BarChart3, Settings, FilePlus2, PlayCircle,
  ClipboardList, FileText, TrendingUp, Award, Sparkles,
};

interface SidebarProps {
  items: NavItem[];
  role: 'admin' | 'teacher' | 'student';
  open: boolean;
  onClose: () => void;
}

const roleTag: Record<SidebarProps['role'], string> = {
  admin: 'Administration',
  teacher: 'Teaching',
  student: 'Learning',
};

export function Sidebar({ items, role, open, onClose }: SidebarProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform duration-300 lg:translate-x-0"
        style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-[#FF3038]" />

        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-primary-glow">
              <GraduationCap size={20} />
            </span>
            <span className="font-display text-lg font-bold text-ink">
              Learn<span className="text-primary">Ix</span>
            </span>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-2 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
            {roleTag[role]} Hub
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
          {items.map((item) => {
            const Icon = icons[item.icon] ?? BookOpen;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-primary-glow'
                      : 'text-muted hover:bg-soft hover:text-ink'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => (window.location.hash = '')} className="btn-ghost w-full justify-start">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
