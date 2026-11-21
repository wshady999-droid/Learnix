import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, PlayCircle, FileText, MousePointerClick, CheckCircle2, Download } from 'lucide-react';
import {
  getCourseBasic,
  getLesson,
  getLessonFileUrl,
  setLessonCompleted,
  type CourseBasic,
  type LessonItem,
} from '@/services/lessons';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState<CourseBasic | null>(null);
  const [lesson, setLesson] = useState<LessonItem | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId || !lessonId) return;
    let active = true;
    (async () => {
      try {
        const [c, l] = await Promise.all([getCourseBasic(courseId), getLesson(lessonId)]);
        if (!active) return;
        setCourse(c);
        setLesson(l);
        setDone(!!l?.completed);
        if (l?.file_path) {
          const url = await getLessonFileUrl(l.file_path);
          if (active) setFileUrl(url);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [courseId, lessonId]);

  const toggleDone = async () => {
    if (!lesson) return;
    const next = !done;
    setSaving(true);
    setError('');
    try {
      await setLessonCompleted(lesson.id, next);
      setDone(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save progress');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!course || !lesson) {
    return <EmptyState icon={<PlayCircle size={26} />} title="Lesson not found" message="Go back and pick a lesson." />;
  }

  const Icon = typeIcon[lesson.type];

  const renderMedia = () => {
    if (lesson.file_path && fileUrl) {
      if (lesson.file_type === 'video') {
        return (
          <div className="aspect-video w-full bg-black">
            <video src={fileUrl} controls controlsList="nodownload" className="h-full w-full" />
          </div>
        );
      }
      if (lesson.file_type === 'pdf') {
        return (
          <div className="h-[75vh] w-full bg-soft">
            <iframe src={fileUrl} title={lesson.title} className="h-full w-full" />
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center gap-3 bg-soft py-14">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-primary-glow">
            <FileText size={28} />
          </span>
          <p className="text-sm font-medium text-ink">{lesson.file_name}</p>
          <a href={fileUrl} target="_blank" rel="noreferrer" download={lesson.file_name ?? undefined} className="btn-primary">
            <Download size={16} /> Download
          </a>
        </div>
      );
    }
    if (lesson.video_url) {
      return (
        <div className="aspect-video w-full bg-black">
          <iframe
            src={lesson.video_url}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="flex h-56 items-center justify-center bg-soft sm:h-72">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-primary-glow">
          <Icon size={28} />
        </span>
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title={lesson.title}
        subtitle={`${course.title} · ${lesson.duration_minutes} min`}
        actions={<Link to={`/student/courses/${course.id}`} className="btn-secondary"><ArrowLeft size={16} /> Back</Link>}
      />

      <div className="card overflow-hidden">
        {renderMedia()}
        <div className="p-6">
          {lesson.content && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{lesson.content}</p>
          )}
          {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
          <button
            onClick={toggleDone}
            disabled={saving}
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
