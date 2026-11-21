import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ClipboardList, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { CourseCard } from '@/components/ui/CourseCard';
import { useAuth } from '@/context/AuthContext';
import { fetchTeacherCourses, fetchTeacherStats, type TeacherStats } from '@/services/teacher';
import type { Course } from '@/types';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<TeacherStats>({
    courses: 0,
    students: 0,
    quizzes: 0,
    toGrade: 0,
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const name = profile.full_name || profile.email || 'You';
        const [c, s] = await Promise.all([
          fetchTeacherCourses(profile.id, name),
          fetchTeacherStats(profile.id),
        ]);
        if (cancelled) return;
        setCourses(c);
        setStats(s);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your dashboard.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your courses at a glance."
        actions={
          <Link to="/teacher/courses/new" className="btn-primary">
            New course
          </Link>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Courses" value={String(stats.courses)} icon={BookOpen} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Students" value={String(stats.students)} icon={Users} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Quizzes" value={String(stats.quizzes)} icon={ClipboardList} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="To grade" value={String(stats.toGrade)} icon={FileText} iconBg="bg-danger/10" iconColor="text-danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">My courses</h3>
            <Link to="/teacher/courses" className="text-sm font-medium text-primary hover:opacity-80">
              View all
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted">Loading...</p>
          ) : courses.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="font-display text-base font-semibold text-ink">No courses yet</p>
              <p className="mt-1 text-sm text-muted">Create your first course to get started.</p>
              <Link to="/teacher/courses/new" className="btn-primary mt-4 inline-flex">
                New course
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {courses.slice(0, 2).map((c) => (
                <CourseCard key={c.id} course={c} href={`/teacher/courses/${c.id}`} />
              ))}
            </div>
          )}
        </div>

        <div className="card h-fit p-6">
          <h3 className="font-display text-base font-semibold text-ink">Coming up</h3>
          {stats.upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No upcoming deadlines.</p>
          ) : (
            <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
              {stats.upcoming.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-3 py-3"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-muted">{a.courseName}</p>
                  </div>
                  <Badge variant="warning">{a.dueDate}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}