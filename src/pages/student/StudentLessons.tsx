import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, PlayCircle, CheckCircle2, FileText, MousePointerClick, ChevronRight } from 'lucide-react';
import { courses, lessons as seedLessons } from '@/services/mockData';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

export default function StudentLessons() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return <EmptyState icon={<PlayCircle size={26} />} title="Course not found" message="Pick a course from My Courses first." />;
  }

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle="Pick a lesson to continue."
        actions={<Link to="/student/courses" className="btn-secondary"><ArrowLeft size={16} /> Back</Link>}
      />
      <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
        {seedLessons.map((l) => {
          const Icon = typeIcon[l.type];
          return (
            <Link
              key={l.id}
              to={`/student/lessons/${course.id}/${l.id}`}
              className="flex items-center gap-4 p-5 transition-colors hover:bg-soft"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${l.completed ? 'bg-success/10 text-success' : 'bg-soft text-muted'}`}>
                {l.completed ? <CheckCircle2 size={17} /> : <Icon size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                <p className="text-xs text-muted capitalize">{l.type} · {l.duration}</p>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
