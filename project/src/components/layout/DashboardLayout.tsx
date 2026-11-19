import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { NavItem } from './navigation';

interface DashboardLayoutProps {
  items: NavItem[];
  role: 'admin' | 'teacher' | 'student';
  userName: string;
}

export function DashboardLayout({ items, role, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const current = [...items]
    .sort((a, b) => b.to.length - a.to.length)
    .find((i) => pathname === i.to || pathname.startsWith(i.to + '/'));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar items={items} role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <TopBar
          role={role}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
          sectionTitle={current?.label ?? 'Dashboard'}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
