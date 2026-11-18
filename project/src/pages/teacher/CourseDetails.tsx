import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpen, Users, Star, Clock, PlayCircle, Edit3 } from 'lucide-react';
import { courses, lessons } from '@/services/mockData';

export default function CourseDetails() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return <EmptyState icon={<BookOpen size={26} />} title="Course not found" message="This course may have been removed." />;
  }

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.category} · ${course.level} · ${course.duration}`}
        actions={
          <>
            <Link to="/teacher/lessons" className="btn-secondary"><Edit3 size={16} /> Manage lessons</Link>
            <button className="btn-primary">Edit course</button>
          </>
        }
      />

      <div className="card overflow-hidden">
        <div className="relative h-52 sm:h-64">
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{course.category}</Badge>
            <Badge variant={course.status === 'published' ? 'success' : 'warning'}>{course.status}</Badge>
            <span className="ml-auto flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-sm font-bold text-amber-500 shadow-sm">
              <Star size={14} fill="currentColor" /> {course.rating}
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed text-gray-600">{course.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Enrolled Students" value={String(course.students)} change="+12 this week" changeType="up" icon={Users} iconBg="bg-primary-50" iconColor="text-primary-600" />
        <StatCard label="Lessons" value={String(course.lessons)} change="Full curriculum" changeType="flat" icon={PlayCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Total Duration" value={course.duration} change="Across all lessons" changeType="flat" icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Curriculum</h3>
        <p className="text-sm text-gray-500">{course.lessons} lessons in this course</p>
        <ul className="mt-4 divide-y divide-gray-100">
          {lessons.map((l) => (
            <li key={l.id} className="flex items-center gap-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><PlayCircle size={17} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                <p className="text-xs text-gray-400 capitalize">{l.type} · {l.duration}</p>
              </div>
              <Badge variant={l.completed ? 'success' : 'neutral'}>{l.completed ? 'Published' : 'Draft'}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
