import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpen, Users, Star, Clock, PlayCircle, Edit3 } from 'lucide-react';
import { fetchManagedCourse, type ManagedCourse } from '@/services/courseManagement';

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<ManagedCourse | null>(null);
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
        const data = await fetchManagedCourse(courseId);
        if (!cancelled) setCourse(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load this course.');
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
        icon={<BookOpen size={26} />}
        title="Course not found"
        message={error || 'This course may have been removed.'}
      />
    );
  }

  const duration =
    course.totalMinutes >= 60
      ? `${Math.round(course.totalMinutes / 60)}h`
      : `${course.totalMinutes}m`;

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.categoryName} - ${course.level} - ${duration}`}
        actions={
          <>
            <Link to={`/teacher/lessons?course=${course.id}`} className="btn-secondary">
              <Edit3 size={16} /> Lessons
            </Link>
            <Link to={`/teacher/courses/${course.id}/edit`} className="btn-primary">
              Edit course
            </Link>
          </>
        }
      />

      <div className="card overflow-hidden">
        <div className="relative h-48 sm:h-60">
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{course.categoryName}</Badge>
            <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
              {course.status}
            </Badge>
            <span className="ml-auto flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-amber-500 shadow-sm">
              <Star size={14} fill="currentColor" /> {course.rating}
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed text-muted">
            {course.description || 'No description yet.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Students" value={String(course.students)} icon={Users} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Lessons" value={String(course.lessons.length)} icon={PlayCircle} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Duration" value={duration} icon={Clock} iconBg="bg-warning/10" iconColor="text-warning" />
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Lessons</h3>
        <p className="text-sm text-muted">{course.lessons.length} lessons in this course</p>
        {course.lessons.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No lessons yet. Add some from the Lessons page.</p>
        ) : (
          <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
            {course.lessons.map((l) => (
              <li
                key={l.id}
                className="flex items-center gap-4 py-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <PlayCircle size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                  <p className="text-xs capitalize text-muted">
                    {l.type} - {l.durationMinutes} min
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}