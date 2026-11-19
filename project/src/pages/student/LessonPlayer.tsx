import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, PlayCircle, FileText, MousePointerClick, CheckCircle2 } from 'lucide-react';
import { courses, lessons as seedLessons } from '@/services/mockData';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const lesson = seedLessons.find((l) => l.id === lessonId);
  const [done, setDone] = useState(!!lesson?.completed);

  if (!course || !lesson) {
    return <EmptyState icon={<PlayCircle size={26} />} title="Lesson not found" message="Go back and pick a lesson." />;
  }

  const Icon = typeIcon[lesson.type];

  return (
    <>
      <PageHeader
        title={lesson.title}
        subtitle={`${course.title} · ${lesson.duration}`}
        actions={<Link to={`/student/lessons/${course.id}`} className="btn-secondary"><ArrowLeft size={16} /> Back</Link>}
      />

      <div className="card overflow-hidden">
        <div className="flex h-56 items-center justify-center bg-soft sm:h-72">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-primary-glow">
            <Icon size={28} />
          </span>
        </div>
        <div className="p-6">
          <p className="text-sm leading-relaxed text-muted">
            Lesson content for “{lesson.title}” will stream here once video hosting is connected. Use the button to mark this lesson complete and track your progress.
          </p>
          <button
            onClick={() => setDone(!done)}
            className={`mt-5 w-full sm:w-auto ${done ? 'btn-secondary' : 'btn-primary'}`}
          >
            <CheckCircle2 size={16} />
            {done ? 'Completed' : 'Mark complete'}
          </button>
        </div>
      </div>
    </>
  );
}
