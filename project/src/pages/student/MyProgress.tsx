import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Trophy, Clock, CheckCircle2, Flame } from 'lucide-react';
import { lessons, courses, weeklyActivity, quizResults } from '@/services/mockData';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function MyProgress() {
  const completed = lessons.filter((l) => l.completed).length;
  const completionRate = Math.round((completed / lessons.length) * 100);
  const totalHours = weeklyActivity.reduce((s, d) => s + d.hours, 0);

  return (
    <>
      <PageHeader title="My Progress" subtitle="A complete picture of your learning journey." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall Completion" value={`${completionRate}%`} change="+6% this week" changeType="up" icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Study Time" value={`${totalHours.toFixed(1)}h`} change="This week" changeType="flat" icon={Clock} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Quizzes Taken" value={String(quizResults.length)} change="Avg 83%" changeType="up" icon={Trophy} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Streak" value="6 days" change="Best: 9 days" changeType="up" icon={Flame} iconBg="bg-red-50" iconColor="text-red-500" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card flex flex-col items-center p-6">
          <h3 className="self-start font-display text-base font-semibold text-ink">Course Completion</h3>
          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="38%" outerRadius="95%" data={courses.filter((c) => c.progress !== undefined).map((c) => ({ name: c.title, value: c.progress ?? 0, fill: '#5B5FEF' }))} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background={{ fill: '#EDEEF5' }} cornerRadius={10} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 w-full space-y-2.5">
            {courses.filter((c) => c.progress !== undefined).map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-gray-500">{c.title}</span>
                <span className="font-bold text-ink">{c.progress}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 xl:col-span-2">
          <h3 className="font-display text-base font-semibold text-ink">Study Consistency</h3>
          <p className="text-sm text-gray-500">Daily study hours and lessons completed</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEF5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
                <Bar dataKey="hours" name="Hours" fill="#5B5FEF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="lessons" name="Lessons" fill="#7C83FD" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary-600" /> Hours studied</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Lessons completed</span>
          </div>
        </div>
      </div>
    </>
  );
}
