import { BookOpen, Trophy, Flame, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { CourseCard } from '@/components/ui/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { courses, assignments, quizResults, weeklyActivity } from '@/services/mockData';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const enrolled = courses.filter((c) => c.progress !== undefined);
  const avgProgress = Math.round(enrolled.reduce((s, c) => s + (c.progress ?? 0), 0) / enrolled.length);
  const dueSoon = assignments.filter((a) => a.status === 'pending' || a.status === 'submitted');

  return (
    <>
      <PageHeader
        title="Hi, Liam"
        subtitle="You're on a 6-day learning streak. Keep it going!"
        actions={<Link to="/student/courses" className="btn-primary"><BookOpen size={16} /> Browse courses</Link>}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled Courses" value={String(enrolled.length)} change="2 in progress" changeType="up" icon={BookOpen} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Average Progress" value={`${avgProgress}%`} change="+6% this week" changeType="up" icon={Trophy} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Study Streak" value="6 days" change="Personal best: 9" changeType="up" icon={Flame} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Time Studied" value="20.3h" change="This week" changeType="flat" icon={Clock} iconBg="bg-sky-50" iconColor="text-sky-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">Continue Learning</h3>
            <Link to="/student/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700">My courses</Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {enrolled.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} href={`/student/courses/${c.id}`} showProgress />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Weekly Activity</h3>
            <p className="text-sm text-gray-500">Hours studied per day</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C83FD" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7C83FD" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDEEF5" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
                  <Area type="monotone" dataKey="hours" name="Hours" stroke="#7C83FD" strokeWidth={2.5} fill="url(#studyFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">Due Soon</h3>
              <Link to="/student/assignments" className="text-sm font-medium text-primary-600 hover:text-primary-700">All</Link>
            </div>
            <ul className="mt-4 space-y-3.5">
              {dueSoon.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.courseName}</p>
                  </div>
                  <Badge variant="warning">{a.dueDate}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary p-6 text-white shadow-md shadow-primary-600/25">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <Trophy size={20} />
            </span>
            <h3 className="mt-3.5 font-display text-base font-semibold">Latest quiz score</h3>
            <p className="mt-1 text-sm text-white/80">{quizResults[0].quizTitle}</p>
            <p className="mt-3 font-display text-3xl font-bold">{quizResults[0].percentage}%</p>
            <Link to="/student/results" className="mt-4 inline-flex rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 transition-colors hover:bg-white/25">
              View all results
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
