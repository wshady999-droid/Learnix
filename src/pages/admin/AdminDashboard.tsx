import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { chartTheme } from '@/hooks/useTheme';
import { useCatalog } from '@/store/catalog';

export default function AdminDashboard() {
  const { users, courses, quizzes, assignments } = useCatalog();
  const active = users.filter((user) => user.status === 'active').length;
  const pending = users.filter((user) => user.status === 'pending').length;
  const published = courses.filter((course) => course.status === 'published').length;
  const overdue = assignments.filter((assignment) => assignment.status === 'overdue').length;

  const enrollment = [...courses]
    .sort((a, b) => b.students - a.students)
    .map((course) => ({
      name: course.title.length > 18 ? `${course.title.slice(0, 16)}…` : course.title,
      students: course.students,
    }));

  const quizScores = quizzes.map((quiz) => ({
    name: quiz.title.length > 18 ? `${quiz.title.slice(0, 16)}…` : quiz.title,
    score: quiz.avgScore,
  }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Counts below come from the demo catalog currently loaded in this session."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Accounts" value={String(users.length)} change={`${active} active`} icon={Users} />
        <StatCard label="Pending approval" value={String(pending)} change="Waiting for review" changeType={pending ? 'down' : 'flat'} icon={Clock} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Published courses" value={String(published)} change={`${courses.length} total`} icon={BookOpen} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Overdue assignments" value={String(overdue)} change={`${assignments.length} assignments`} changeType={overdue ? 'down' : 'flat'} icon={GraduationCap} iconBg="bg-danger/10" iconColor="text-danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink">Enrollment on each course</h3>
          <p className="text-sm text-muted">Student counts stored on the course records.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollment} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chartTheme.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} width={36} tick={{ fill: chartTheme.axis, fontSize: 12 }} />
                <Tooltip contentStyle={chartTheme.tooltip} cursor={{ fill: 'var(--primary-soft)' }} />
                <Bar dataKey="students" name="Students" fill="#E50914" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink">Average quiz scores</h3>
          <p className="text-sm text-muted">Scores stored on each quiz. New attempts are not folded into these averages.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizScores} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={chartTheme.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{ fill: chartTheme.axis, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} width={36} tick={{ fill: chartTheme.axis, fontSize: 12 }} />
                <Tooltip contentStyle={chartTheme.tooltip} cursor={{ fill: 'var(--primary-soft)' }} />
                <Bar dataKey="score" name="Average %" fill="#E50914" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Courses by enrollment</h3>
          <Link to="/admin/courses" className="text-sm font-medium text-primary">Manage courses</Link>
        </div>
        <ul className="mt-3 divide-y" style={{ borderColor: 'var(--border)' }}>
          {enrollment.length === 0 && <li className="py-6 text-sm text-muted">No courses yet.</li>}
          {[...courses].sort((a, b) => b.students - a.students).map((course, index) => (
            <li key={course.id} className="flex items-center gap-3 py-3" style={{ borderColor: 'var(--border)' }}>
              <span className="w-5 text-sm text-muted">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <Link to={`/admin/courses/${course.id}`} className="truncate text-sm font-medium text-ink hover:text-primary">{course.title}</Link>
                <p className="text-xs text-muted">{course.instructor} · {course.status}</p>
              </div>
              <span className="text-sm text-muted">{course.students} students</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
