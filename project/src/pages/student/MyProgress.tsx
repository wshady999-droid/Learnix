import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@/context/AuthContext';
import { fetchStudentOverview } from '@/services/courses';
import { fetchQuizResults } from '@/services/quizzes';
import type { Course } from '@/types';

export default function MyProgress() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [minutesSpent, setMinutesSpent] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [quizAverage, setQuizAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const [overview, results] = await Promise.all([
          fetchStudentOverview(profile.id),
          fetchQuizResults(profile.id),
        ]);
        if (cancelled) return;
        setCourses(overview.courses);
        setCompletedLessons(overview.completedLessons);
        setMinutesSpent(overview.minutesSpent);
        setQuizCount(results.length);
        setQuizAverage(
          results.length
            ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
            : 0
        );
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your progress.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
  const completionRate = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <>
      <PageHeader title="My Progress" subtitle="How you're doing overall." />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completion" value={`${completionRate}%`} icon={CheckCircle2} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Study time" value={`${(minutesSpent / 60).toFixed(1)}h`} icon={Clock} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Quiz average" value={quizCount ? `${quizAverage}%` : '-'} change={`${quizCount} quizzes`} changeType="flat" icon={Trophy} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Lessons done" value={String(completedLessons)} icon={BookOpen} iconBg="bg-danger/10" iconColor="text-danger" />
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Course progress</h3>
        <p className="text-sm text-muted">Each course you're enrolled in</p>

        {loading ? (
          <p className="mt-5 text-sm text-muted">Loading...</p>
        ) : courses.length === 0 ? (
          <div className="mt-5 text-center">
            <p className="text-sm text-muted">You are not enrolled in any course yet.</p>
            <Link to="/student/browse" className="btn-primary mt-4 inline-flex">
              Browse courses
            </Link>
          </div>
        ) : (
          <ul className="mt-5 space-y-5">
            {courses.map((c) => (
              <li key={c.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-ink">{c.title}</span>
                  <span className="font-bold text-ink">{c.progress ?? 0}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-soft">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${c.progress ?? 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}