import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { courses, users, enrollmentTrend, categories } from '@/services/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';

export default function AdminDashboard() {
  const students = users.filter((u) => u.role === 'student').length;
  const teachers = users.filter((u) => u.role === 'teacher').length;

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Platform overview at a glance." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value="1,265" change="+12% this month" changeType="up" icon={Users} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Active Courses" value={String(courses.length * 14)} change="+4 new this month" changeType="up" icon={BookOpen} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Completions" value="3,842" change="+8% this month" changeType="up" icon={GraduationCap} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Revenue (MTD)" value="$24.6k" change="+5% vs last month" changeType="up" icon={DollarSign} iconBg="bg-sky-50" iconColor="text-sky-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <h3 className="font-display text-base font-semibold text-ink">Enrollment Growth</h3>
          <p className="text-sm text-gray-500">Monthly active students vs. course count</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B5FEF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#5B5FEF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEF5" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5', boxShadow: '0 4px 16px rgba(32,34,53,0.08)' }} />
                <Area type="monotone" dataKey="students" stroke="#5B5FEF" strokeWidth={2.5} fill="url(#studentsFill)" name="Students" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Courses by Category</h3>
          <p className="text-sm text-gray-500">Distribution across the catalog</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="courseCount" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3} strokeWidth={0}>
                  {categories.map((c) => <Cell key={c.id} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Top Courses</h3>
          <ul className="mt-4 space-y-4">
            {[...courses].sort((a, b) => b.students - a.students).slice(0, 5).map((c, i) => (
              <li key={c.id} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-600">{i + 1}</span>
                <img src={c.thumbnail} alt="" className="h-10 w-14 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.instructor}</p>
                </div>
                <Badge variant="primary">{c.students} students</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">User Distribution</h3>
          <p className="text-sm text-gray-500">Students, teachers and admins</p>
          <div className="mt-6 space-y-5">
            {[
              { label: 'Students', value: students + 1240, max: 1400, color: 'bg-primary-500' },
              { label: 'Teachers', value: teachers + 62, max: 1400, color: 'bg-emerald-500' },
              { label: 'Admins', value: 3, max: 1400, color: 'bg-amber-500' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{row.label}</span>
                  <span className="text-gray-500">{row.value.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${row.color} transition-all duration-700`} style={{ width: `${Math.max((row.value / row.max) * 100, 3)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-primary-50 p-5">
            <h4 className="font-display text-sm font-semibold text-primary-800">Weekly active learners</h4>
            <p className="mt-1 text-3xl font-bold text-primary-700 font-display">842 <span className="text-sm font-medium text-primary-500">/ 1,265</span></p>
            <div className="mt-3 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ d: 'M', v: 62 }, { d: 'T', v: 71 }, { d: 'W', v: 58 }, { d: 'T', v: 80 }, { d: 'F', v: 66 }, { d: 'S', v: 44 }, { d: 'S', v: 38 }]}>
                  <Bar dataKey="v" fill="#5B5FEF" radius={[6, 6, 0, 0]} />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: '#8A8FBF', fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
