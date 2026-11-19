import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlayCircle, Clock, Star, Users, CheckCircle2, Lock } from 'lucide-react';
import { courses, lessons } from '@/services/mockData';

export default function StudentCourseDetails() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return <EmptyState icon={<PlayCircle size={26} />} title="Course not found" message="This course may have been removed." />;
  }

  const done = lessons.filter((l) => l.completed).length;
  const pct = Math.round((done / lessons.length) * 100);

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.category} · Taught by ${course.instructor}`}
        actions={<button className="btn-primary"><PlayCircle size={16} /> Continue</button>}
      />

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
            { icon: Clock, label: 'Duration', value: course.duration },
            { icon: PlayCircle, label: 'Lessons', value: String(course.lessons) },
            { icon: Users, label: 'Students', value: String(course.students) },
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

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">Lessons</h3>
              <span className="text-sm text-muted">{done} / {lessons.length} done</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <ul className="mt-5 divide-y" style={{ borderColor: 'var(--border)' }}>
              {lessons.map((l) => {
                const isDone = !!l.completed;
                return (
                  <li key={l.id} className="flex items-center gap-4 py-3" style={{ borderColor: 'var(--border)' }}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isDone ? 'bg-success/10 text-success' : 'bg-soft text-muted'}`}>
                      {isDone ? <CheckCircle2 size={17} /> : <Lock size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${isDone ? 'text-ink' : 'text-muted'}`}>{l.title}</p>
                      <p className="text-xs text-muted capitalize">{l.type} · {l.duration}</p>
                    </div>
                    {isDone && <button className="btn-secondary py-1.5 text-xs">Rewatch</button>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Your progress</h3>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{course.progress ?? 0}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-soft">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${course.progress ?? 0}%` }} />
            </div>
            <p className="mt-3 text-sm text-muted">Next: {course.nextLesson}</p>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Teacher</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {course.instructor.split(' ').map((p) => p[0]).join('')}
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
