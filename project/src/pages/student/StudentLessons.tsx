import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  FileText,
  MousePointerClick,
  ChevronRight,
} from 'lucide-react';
import {
  getCourseBasic,
  getCourseLessons,
  type CourseBasic,
  type LessonItem,
} from '@/services/lessons';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

export default function StudentLessons() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseBasic | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [c, l] = await Promise.all([getCourseBasic(courseId), getCourseLessons(courseId)]);
        if (cancelled) return;
        setCourse(c);
        setLessons(l);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load the lessons.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!course) {
    return (
      <EmptyState
        icon={<PlayCircle size={26} />}
        title="Course not found"
        message={error || 'Pick a course from My Courses first.'}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle="Pick a lesson to continue."
        actions={
          <Link to="/student/courses" className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-display text-base font-semibold text-ink">No lessons yet</p>
          <p className="mt-1 text-sm text-muted">Your teacher has not added lessons to this course.</p>
        </div>
      ) : (
        <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
          {lessons.map((l) => {
            const Icon = typeIcon[l.type] ?? PlayCircle;
            return (
              <Link
                key={l.id}
                to={`/student/lessons/${course.id}/${l.id}`}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-soft"
                style={{ borderColor: 'var(--border)' }}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    l.completed ? 'bg-success/10 text-success' : 'bg-soft text-muted'
                  }`}
                >
                  {l.completed ? <CheckCircle2 size={17} /> : <Icon size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                  <p className="text-xs capitalize text-muted">
                    {l.type} - {l.duration_minutes} min
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}