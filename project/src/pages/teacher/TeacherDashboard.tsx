import { BookOpen, Users, ClipboardList, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { CourseCard } from '@/components/ui/CourseCard';
import { courses, assignments } from '@/services/mockData';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const myCourses = courses.filter((c) => c.instructorId === 'u2');
  const totalStudents = myCourses.reduce((sum, c) => sum + c.students, 0);
  const toGrade = (assignments[0].submissions ?? 0) - (assignments[0].graded ?? 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your courses at a glance."
        actions={<Link to="/teacher/courses/new" className="btn-primary">New course</Link>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Courses" value={String(myCourses.length)} change="+1 this term" changeType="up" icon={BookOpen} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Students" value={totalStudents.toLocaleString()} change="+34 this week" changeType="up" icon={Users} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Quizzes" value="4" change="1 draft" changeType="flat" icon={ClipboardList} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="To grade" value={String(toGrade)} change="Due Nov 28" changeType="down" icon={FileText} iconBg="bg-danger/10" iconColor="text-danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">My courses</h3>
            <Link to="/teacher/courses" className="text-sm font-medium text-primary hover:opacity-80">View all</Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {myCourses.slice(0, 2).map((c) => (
              <CourseCard key={c.id} course={c} href={`/teacher/courses/${c.id}`} />
            ))}
          </div>
        </div>

        <div className="card h-fit p-6">
          <h3 className="font-display text-base font-semibold text-ink">Coming up</h3>
          <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
            {assignments.slice(0, 3).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3" style={{ borderColor: 'var(--border)' }}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                  <p className="text-xs text-muted">{a.courseName}</p>
                </div>
                <Badge variant={a.status === 'overdue' ? 'danger' : 'warning'}>{a.dueDate}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
