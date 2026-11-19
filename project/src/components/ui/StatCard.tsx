import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'flat';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  label, value, change, changeType = 'flat', icon: Icon,
  iconColor = 'text-primary', iconBg = 'bg-primary-soft',
}: StatCardProps) {
  return (
    <div className="card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink font-display">{value}</p>
          {change && (
            <p className={`mt-1.5 text-xs font-medium ${
              changeType === 'up' ? 'text-success' : changeType === 'down' ? 'text-danger' : 'text-muted'
            }`}>
              {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '—'} {change}
            </p>
          )}
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </span>
      </div>
    </div>
  );
}
