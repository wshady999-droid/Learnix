import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Download, FileText, Users, Clock, GraduationCap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { weeklyActivity, enrollmentTrend, studentPerformance } from '@/services/mockData';
import { Badge } from '@/components/ui/Badge';

export default function Reports() {
  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Platform-wide analytics and exportable reports."
        actions={<button className="btn-primary"><Download size={16} /> Export PDF</button>}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg. Completion Rate" value="68%" change="+4% this quarter" changeType="up" icon={GraduationCap} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Avg. Session Length" value="42 min" change="+2 min this quarter" changeType="up" icon={Clock} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Active Learners" value="842" change="+61 this week" changeType="up" icon={Users} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Reports Generated" value="126" change="12 this month" changeType="flat" icon={FileText} iconBg="bg-sky-50" iconColor="text-sky-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Study Hours by Day</h3>
          <p className="text-sm text-gray-500">Aggregate hours across all learners last week</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEF5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
                <Bar dataKey="hours" name="Hours" fill="#5B5FEF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Growth Trend</h3>
          <p className="text-sm text-gray-500">Students vs. courses over six months</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEF5" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="students" name="Students" stroke="#5B5FEF" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="courses" name="Courses" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Top Performers</h3>
        <p className="text-sm text-gray-500">Highest average scores this semester</p>
        <ul className="mt-5 space-y-4">
          {studentPerformance.map((s) => (
            <li key={s.id} className="flex items-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary text-xs font-bold text-white">
                {s.name.split(' ').map((p) => p[0]).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                <p className="text-xs text-gray-400">{s.coursesEnrolled} courses · {s.timeSpent} studied</p>
              </div>
              <div className="hidden w-40 sm:block">
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary" style={{ width: `${s.avgScore}%` }} />
                </div>
              </div>
              <Badge variant={s.avgScore >= 85 ? 'success' : s.avgScore >= 70 ? 'warning' : 'danger'}>{s.avgScore}% avg</Badge>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
