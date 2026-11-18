import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Tags, BarChart3, Settings, FilePlus2, PlayCircle,
  ClipboardList, FileText, TrendingUp, Award, Sparkles, X, LogOut, Brain,
} from 'lucide-react';
import type { NavItem } from './navigation';
import { roleHome } from './navigation';

const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  LayoutDashboard, Users, BookOpen, Tags, BarChart3, Settings, FilePlus2, PlayCircle,
  ClipboardList, FileText, TrendingUp, Award, Sparkles,
};

interface SidebarProps {
  items: NavItem[];
  role: 'admin' | 'teacher' | 'student';
  open: boolean;
  onClose: () => void;
}

const gradient: Record<SidebarProps['role'], string> = {
  admin: 'from-ink to-gray-800',
  teacher: 'from-primary-700 to-primary-900',
  student: 'from-secondary to-primary-700',
};

export function Sidebar({ items, role, open, onClose }: SidebarProps) {
  const { pathname } = useLocation();
  const home = roleHome[role];

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b ${gradient[role]} transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
              <Brain size={20} />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Brain<span className="text-primary-200">Up</span>
            </span>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-white/70 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-2 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {role === 'admin' ? 'Administration' : role === 'teacher' ? 'Teaching' : 'Learning'} Hub
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
          {items.map((item) => {
            const Icon = iconMap[item.icon] ?? BookOpen;
            const to = item.to === '/' ? home : item.to;
            return (
              <NavLink
                key={item.to}
                to={to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => (window.location.hash = '')}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
