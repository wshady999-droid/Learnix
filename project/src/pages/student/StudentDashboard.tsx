import { useEffect, useState } from 'react';
import { BookOpen, Trophy, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { CourseCard } from '@/components/ui/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import {
  fetchStudentOverview,
  fetchDueAssignments,
  fetchLatestAttempt,
  type DueAssignment,
} from '@/services/courses';
import type { Course } from '@/types';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [minutesSpent, setMinutesSpent] = useState(0);
  const [due, setDue] = useState<DueAssignment[]>([]);
  const [latest, setLatest] = useState<{ quizTitle: string; percentage: number } | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const overview = await fetchStudentOverview(profile!.id);
        const [dueList, latestAttempt] = await Promise.all([
          fetchDueAssignments(profile!.id, overview.courses.map((c) => c.id)),
          fetchLatestAttempt(profile!.id),
        ]);
        if (cancelled) return;
        setCourses(overview.courses);
        setCompletedLessons(overview.completedLessons);
        setMinutesSpent(overview.minutesSpent);
        setDue(dueList);
        setLatest(latestAttempt);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Something went wrong while loading your data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const avgProgress = courses.length
    ? Math.round(courses.reduce((s, c) => s + (c.progress ?? 0), 0) / courses.length)
    : 0;
  const studyHours = (minutesSpent / 60).toFixed(1);
  const firstName = (profile?.full_name || profile?.email || 'there').split(' ')[0].split('@')[0];

  return (
    <>
      <PageHeader
        title={`Hi, ${firstName}`}
        subtitle={
          courses.length
            ? 'Keep going, you are doing great!'
            : 'Welcome to LearnIx. Browse courses to get started.'
        }
        actions={
          <Link to={courses.length ? '/student/courses' : '/student/browse'} className="btn-primary">
            {courses.length ? 'My courses' : 'Browse courses'}
          </Link>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Courses" value={String(courses.length)} icon={BookOpen} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Progress" value={`${avgProgress}%`} icon={Trophy} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Lessons done" value={String(completedLessons)} icon={CheckCircle2} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Study time" value={`${studyHours}h`} icon={Clock} iconBg="bg-primary-soft" iconColor="text-primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink">Continue learning</h3>
            <Link to="/student/courses" className="text-sm font-medium text-primary hover:opacity-80">All courses</Link>
          </div>

          {loading ? (
            <p className="text-sm text-muted">Loading...</p>
          ) : courses.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="font-display text-base font-semibold text-ink">No courses yet</p>
              <p className="mt-1 text-sm text-muted">Enroll in a course to see it here.</p>
              <Link to="/student/browse" className="btn-primary mt-4 inline-flex">Browse courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {courses.slice(0, 4).map((c) => (
                <CourseCard key={c.id} course={c} href={`/student/courses/${c.id}`} showProgress />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">Due soon</h3>
              <Link to="/student/assignments" className="text-sm font-medium text-primary hover:opacity-80">All</Link>
            </div>
            {due.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Nothing due. You are all caught up.</p>
            ) : (
              <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
                {due.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3" style={{ borderColor: 'var(--border)' }}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                      <p className="text-xs text-muted">{a.course}</p>
                    </div>
                    <Badge variant="warning">{a.due}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Trophy size={18} />
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">Latest quiz score</h3>
            {latest ? (
              <>
                <p className="mt-1 text-sm text-muted">{latest.quizTitle}</p>
                <p className="mt-2 font-display text-3xl font-bold text-primary">{latest.percentage}%</p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">No quizzes taken yet.</p>
            )}
            <Link to="/student/results" className="mt-3 inline-flex text-sm font-medium text-primary hover:opacity-80">
              View all results
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}