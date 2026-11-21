import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlayCircle, Clock, Star, BarChart3, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchCourseDetails,
  setLessonCompleted,
  type CourseDetails,
} from '@/services/courseDetails';

export default function StudentCourseDetails() {
  const { courseId } = useParams();
  const { profile } = useAuth();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!courseId || !profile?.id) return;
    try {
      setError('');
      const data = await fetchCourseDetails(courseId, profile.id);
      setCourse(data);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load this course.');
    } finally {
      setLoading(false);
    }
  }, [courseId, profile?.id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function toggleLesson(lessonId: string, completed: boolean, minutes: number) {
    if (!profile?.id) return;
    try {
      setBusyId(lessonId);
      setError('');
      await setLessonCompleted(profile.id, lessonId, completed, minutes);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Could not update the lesson.');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!course) {
    return (
      <EmptyState
        icon={<PlayCircle size={26} />}
        title="Course not found"
        message={error || 'This course may have been removed.'}
      />
    );
  }

  const total = course.lessons.length;
  const done = course.lessons.filter((l) => l.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const nextLesson = course.lessons.find((l) => !l.completed);
  const durationLabel =
    course.totalMinutes >= 60
      ? `${Math.round(course.totalMinutes / 60)}h`
      : `${course.totalMinutes}m`;

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.category} - Taught by ${course.instructor}`}
        actions={
          <Link to="/student/courses" className="btn-primary">
            My courses
          </Link>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="relative h-48 sm:h-60">
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-5 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{course.category}</Badge>
            <Badge variant="neutral">{course.level}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          {[
            { icon: Clock, label: 'Duration', value: durationLabel },
            { icon: PlayCircle, label: 'Lessons', value: String(total) },
            { icon: BarChart3, label: 'Level', value: course.level },
            { icon: Star, label: 'Rating', value: String(course.rating) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl bg-soft p-4 text-center">
              <Icon size={18} className="mx-auto text-primary" />
              <p className="mt-2 text-sm font-bold text-ink">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {course.description && (
        <div className="card mt-6 p-6">
          <h3 className="font-display text-base font-semibold text-ink">About this course</h3>
          <p className="mt-2 text-sm text-muted">{course.description}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">Lessons</h3>
              <span className="text-sm text-muted">
                {done} / {total} done
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            {!course.enrolled ? (
              <div className="mt-5 rounded-xl bg-soft p-5 text-center">
                <p className="text-sm font-medium text-ink">You are not enrolled in this course.</p>
                <p className="mt-1 text-xs text-muted">Enroll to see and complete its lessons.</p>
                <Link to="/student/browse" className="btn-primary mt-4 inline-flex">
                  Browse courses
                </Link>
              </div>
            ) : total === 0 ? (
              <p className="mt-5 text-sm text-muted">No lessons have been added yet.</p>
            ) : (
              <ul className="mt-5 divide-y" style={{ borderColor: 'var(--border)' }}>
                {course.lessons.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center gap-4 py-3"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        l.completed ? 'bg-success/10 text-success' : 'bg-soft text-muted'
                      }`}
                    >
                      {l.completed ? <CheckCircle2 size={17} /> : <Circle size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/student/lessons/${course.id}/${l.id}`}
                        className={`block truncate text-sm font-medium hover:text-primary ${
                          l.completed ? 'text-ink' : 'text-muted'
                        }`}
                      >
                        {l.title}
                      </Link>
                      <p className="text-xs capitalize text-muted">
                        {l.type} - {l.durationMinutes} min
                      </p>
                    </div>
                    <button
                      className="btn-secondary py-1.5 text-xs"
                      disabled={busyId === l.id}
                      onClick={() => toggleLesson(l.id, !l.completed, l.durationMinutes)}
                    >
                      {busyId === l.id
                        ? 'Saving...'
                        : l.completed
                        ? 'Mark incomplete'
                        : 'Mark complete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Your progress</h3>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{pct}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted">
              {total === 0
                ? 'No lessons yet'
                : nextLesson
                ? `Next: ${nextLesson.title}`
                : 'You completed all lessons!'}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Teacher</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {course.instructor
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{course.instructor}</p>
                <p className="text-xs text-muted">Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}