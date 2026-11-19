import { BookOpen, Trophy, Flame, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { CourseCard } from '@/components/ui/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { courses, assignments, quizResults } from '@/services/mockData';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const enrolled = courses.filter((c) => c.progress !== undefined);
  const avgProgress = Math.round(enrolled.reduce((s, c) => s + (c.progress ?? 0), 0) / enrolled.length);
  const dueSoon = assignments.filter((a) => a.status === 'pending' || a.status === 'submitted');

  return (
    <>
      <PageHeader
        title="Hi, Liam"
        subtitle="You're on a 6-day streak. Keep going!"
        actions={<Link to="/student/courses" className="btn-primary">My courses</Link>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Courses" value={String(enrolled.length)} change="2 in progress" changeType="up" icon={BookOpen} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Progress" value={`${avgProgress}%`} change="+6% this week" changeType="up" icon={Trophy} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Streak" value="6 days" change="Best: 9 days" changeType="up" icon={Flame} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Study time" value="20.3h" change="This week" changeType="flat" icon={Clock} iconBg="bg-primary-soft" iconColor="text-primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">Continue learning</h3>
            <Link to="/student/courses" className="text-sm font-medium text-primary hover:opacity-80">All courses</Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {enrolled.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} href={`/student/courses/${c.id}`} showProgress />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">Due soon</h3>
              <Link to="/student/assignments" className="text-sm font-medium text-primary hover:opacity-80">All</Link>
            </div>
            <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
              {dueSoon.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-muted">{a.courseName}</p>
                  </div>
                  <Badge variant="warning">{a.dueDate}</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Trophy size={18} />
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">Latest quiz score</h3>
            <p className="mt-1 text-sm text-muted">{quizResults[0].quizTitle}</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary">{quizResults[0].percentage}%</p>
            <Link to="/student/results" className="mt-3 inline-flex text-sm font-medium text-primary hover:opacity-80">
              View all results
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
