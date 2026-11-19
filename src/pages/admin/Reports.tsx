import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Download, FileText, Users, Clock, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { weeklyActivity, studentPerformance } from '@/services/mockData';
import { chartTheme } from '@/hooks/useTheme';

export default function Reports() {
  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Key numbers for the whole platform."
        actions={<button className="btn-primary"><Download size={16} /> Export</button>}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completion rate" value="68%" change="+4% this quarter" changeType="up" icon={GraduationCap} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Avg. session" value="42 min" change="+2 min" changeType="up" icon={Clock} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Active learners" value="842" change="+61 this week" changeType="up" icon={Users} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Reports made" value="126" change="12 this month" changeType="flat" icon={FileText} iconBg="bg-primary-soft" iconColor="text-primary" />
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Study hours</h3>
        <p className="text-sm text-muted">All learners, last week</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: chartTheme.axis, fontSize: 12 }} />
              <Tooltip contentStyle={chartTheme.tooltip} cursor={{ fill: 'var(--primary-soft)' }} />
              <Bar dataKey="hours" name="Hours" fill="#E50914" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Top students</h3>
        <p className="text-sm text-muted">Best average scores</p>
        <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
          {studentPerformance.map((s) => (
            <li key={s.id} className="flex items-center gap-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {s.name.split(' ').map((p) => p[0]).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-xs text-muted">{s.coursesEnrolled} courses · {s.timeSpent} studied</p>
              </div>
              <span className="text-sm font-bold text-ink">{s.avgScore}%</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
