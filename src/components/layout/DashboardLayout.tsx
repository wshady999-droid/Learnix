import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { isItemActive, roleHome, type NavItem } from './navigation';
import { useSession } from '@/store/session';
import type { Role } from '@/types';

interface DashboardLayoutProps {
  items: NavItem[];
  role: Role;
}

export function DashboardLayout({ items, role }: DashboardLayoutProps) {
  const { session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to={roleHome[session.role]} replace />;

  const current = items
    .filter((item) => isItemActive(pathname, item))
    .sort((a, b) => b.to.length - a.to.length)[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar items={items} role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 lg:pl-64">
        <TopBar
          items={items}
          role={role}
          userName={session.name}
          onMenuClick={() => setSidebarOpen(true)}
          sectionTitle={current?.label ?? 'Dashboard'}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div key={pathname}>
            <Outlet />
          </div>
        </main>
        <p className="mx-auto max-w-7xl px-4 pb-6 text-center text-xs text-muted sm:px-6 lg:px-8">
          Sample workspace. Records stay in this browser session and are not loaded from a database.
        </p>
      </div>
    </div>
  );
}
