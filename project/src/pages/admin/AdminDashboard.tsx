import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { courses, users, enrollmentTrend, weeklyActivity } from '@/services/mockData';
import { chartTheme } from '@/hooks/useTheme';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const students = users.filter((u) => u.role === 'student').length;
  const teachers = users.filter((u) => u.role === 'teacher').length;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="How LearnIx is doing this month." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value="1,265" change="+12% this month" changeType="up" icon={Users} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Courses" value={String(courses.length * 14)} change="+4 new" changeType="up" icon={BookOpen} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Completions" value="3,842" change="+8% this month" changeType="up" icon={GraduationCap} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Revenue" value="$24.6k" change="+5% vs last month" changeType="up" icon={DollarSign} iconBg="bg-primary-soft" iconColor="text-primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">New students</h3>
          <p className="text-sm text-muted">Last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: chartTheme.axis, fontSize: 12 }} />
                <Tooltip contentStyle={chartTheme.tooltip} cursor={{ fill: 'var(--primary-soft)' }} />
                <Bar dataKey="students" name="Students" fill="#E50914" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Study hours</h3>
          <p className="text-sm text-muted">This week, all learners</p>
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
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Popular courses</h3>
        <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
          {[...courses].sort((a, b) => b.students - a.students).slice(0, 5).map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">{i + 1}</span>
              <img src={c.thumbnail} alt="" className="h-10 w-14 rounded-lg object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{c.title}</p>
                <p className="text-xs text-muted">{c.instructor}</p>
              </div>
              <span className="text-sm font-medium text-muted">{c.students} students</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        {students + teachers} team members and 1,265 learners use LearnIx.
      </p>
    </>
  );
}
