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

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.category} · Taught by ${course.instructor}`}
        actions={<button className="btn-primary"><PlayCircle size={16} /> Continue: {course.nextLesson ?? 'Start course'}</button>}
      />

      <div className="card overflow-hidden">
        <div className="relative h-52 sm:h-64">
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
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
            <div key={label} className="rounded-xl bg-gray-50 p-4 text-center">
              <Icon size={18} className="mx-auto text-primary-500" />
              <p className="mt-2 text-sm font-bold text-ink">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-ink">Course Content</h3>
              <span className="text-sm text-gray-500">{lessons.filter((l) => l.completed).length} / {lessons.length} done</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary transition-all duration-700" style={{ width: `${(lessons.filter((l) => l.completed).length / lessons.length) * 100}%` }} />
            </div>
            <ul className="mt-5 divide-y divide-gray-100">
              {lessons.map((l) => {
                const done = !!l.completed;
                return (
                  <li key={l.id} className={`flex items-center gap-4 py-3.5 ${!done ? 'rounded-xl' : ''}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                      {done ? <CheckCircle2 size={17} /> : <Lock size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${done ? 'text-ink' : 'text-gray-400'}`}>{l.title}</p>
                      <p className="text-xs text-gray-400 capitalize">{l.type} · {l.duration}</p>
                    </div>
                    {done && <button className="btn-secondary py-1.5 text-xs">Rewatch</button>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-secondary p-6 text-white shadow-md shadow-primary-600/25">
            <h3 className="font-display text-base font-semibold">Your progress</h3>
            <p className="mt-3 font-display text-4xl font-bold">{course.progress ?? 0}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${course.progress ?? 0}%` }} />
            </div>
            <p className="mt-3 text-sm text-white/80">Next up: {course.nextLesson}</p>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink">Instructor</h3>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary font-bold text-white">DR</span>
              <div>
                <p className="text-sm font-semibold text-ink">{course.instructor}</p>
                <p className="text-xs text-gray-400">Senior Instructor</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Specializes in hands-on, project-based teaching with a focus on real-world applications.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
