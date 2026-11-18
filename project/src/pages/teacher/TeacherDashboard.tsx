import { BookOpen, Users, ClipboardList, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { CourseCard } from '@/components/ui/CourseCard';
import { courses, assignments, quizzes, weeklyActivity } from '@/services/mockData';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherDashboard() {
  const myCourses = courses.filter((c) => c.instructorId === 'u2');
  const totalStudents = myCourses.reduce((sum, c) => sum + c.students, 0);
  const ungraded = assignments[0];

  return (
    <>
      <PageHeader
        title="Welcome back, Daniel"
        subtitle="Here's what's happening across your courses today."
        actions={<Link to="/teacher/courses/new" className="btn-primary">Create course</Link>}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Courses" value={String(myCourses.length)} change="+1 this semester" changeType="up" icon={BookOpen} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Enrolled Students" value={totalStudents.toLocaleString()} change="+34 this week" changeType="up" icon={Users} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Active Quizzes" value={String(quizzes.length)} change="1 draft pending" changeType="flat" icon={ClipboardList} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard label="Submissions to Grade" value={String(ungraded.submissions! - ungraded.graded!)} change="Due Nov 28" changeType="down" icon={FileText} iconBg="bg-red-50" iconColor="text-red-500" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">My Courses</h3>
            <Link to="/teacher/courses" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {myCourses.slice(0, 2).map((c) => (
              <CourseCard key={c.id} course={c} href={`/teacher/courses/${c.id}`} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Teaching Hours</h3>
            <p className="text-sm text-gray-500">Time spent on lessons and grading</p>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDEEF5" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
                  <Bar dataKey="hours" name="Hours" fill="#7C83FD" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Upcoming Deadlines</h3>
            <ul className="mt-4 space-y-3.5">
              {assignments.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.courseName}</p>
                  </div>
                  <Badge variant={a.status === 'overdue' ? 'danger' : 'warning'}>{a.dueDate}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
