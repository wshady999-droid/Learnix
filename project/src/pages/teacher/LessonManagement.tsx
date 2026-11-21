import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  PlayCircle,
  FileText,
  MousePointerClick,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  addLesson,
  deleteLesson,
  fetchLessons,
  fetchTeacherCourseOptions,
  updateLesson,
  type CourseOption,
  type LessonType,
  type ManagedLesson,
} from '@/services/courseManagement';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

const emptyForm = {
  title: '',
  type: 'video' as LessonType,
  durationMinutes: '20',
  videoUrl: '',
};

export default function LessonManagement() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [courseId, setCourseId] = useState('');
  const [lessons, setLessons] = useState<ManagedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedLesson | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const options = await fetchTeacherCourseOptions(profile.id);
        if (cancelled) return;
        setCourses(options);
        const fromUrl = searchParams.get('course');
        const valid = options.find((c) => c.id === fromUrl);
        setCourseId(valid ? valid.id : options[0]?.id ?? '');
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your courses.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const loadLessons = useCallback(async () => {
    if (!courseId) {
      setLessons([]);
      return;
    }
    try {
      setError('');
      setLessons(await fetchLessons(courseId));
    } catch (e: any) {
      setError(e?.message ?? 'Could not load lessons.');
    }
  }, [courseId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const currentCourse = courses.find((c) => c.id === courseId);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (l: ManagedLesson) => {
    setForm({
      title: l.title,
      type: l.type,
      durationMinutes: String(l.durationMinutes),
      videoUrl: l.videoUrl,
    });
    setEditing(l);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !form.title.trim()) return;
    const minutes = Math.max(0, parseInt(form.durationMinutes, 10) || 0);
    const input = {
      title: form.title.trim(),
      type: form.type,
      durationMinutes: minutes,
      videoUrl: form.videoUrl.trim(),
    };
    try {
      setSaving(true);
      setError('');
      if (editing) {
        await updateLesson(editing.id, input);
      } else {
        const nextPosition = lessons.length ? Math.max(...lessons.map((l) => l.position)) + 1 : 0;
        await addLesson(courseId, input, nextPosition);
      }
      setOpen(false);
      await loadLessons();
    } catch (err: any) {
      setError(err?.message ?? 'Could not save the lesson.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (l: ManagedLesson) => {
    if (!window.confirm(`Delete "${l.title}"?`)) return;
    try {
      setError('');
      await deleteLesson(l.id);
      await loadLessons();
    } catch (err: any) {
      setError(err?.message ?? 'Could not delete the lesson.');
    }
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<PlayCircle size={26} />}
        title="No courses yet"
        message="Create a course first, then add its lessons here."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Lessons"
        subtitle={
          currentCourse ? `${currentCourse.title} - ${lessons.length} lessons` : 'Your lesson list.'
        }
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add lesson
          </button>
        }
      />

      <div className="mb-5 max-w-sm">
        <label htmlFor="course-pick" className="label">Course</label>
        <select
          id="course-pick"
          className="input"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setSearchParams({ course: e.target.value });
          }}
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-display text-base font-semibold text-ink">No lessons yet</p>
          <p className="mt-1 text-sm text-muted">Add the first lesson for this course.</p>
        </div>
      ) : (
        <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
          {lessons.map((l) => {
            const Icon = typeIcon[l.type] ?? PlayCircle;
            return (
              <div
                key={l.id}
                className="flex items-center gap-4 p-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                  <p className="text-xs capitalize text-muted">
                    {l.type} - {l.durationMinutes} min
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    className="btn-ghost p-2"
                    onClick={() => openEdit(l)}
                    aria-label="Edit lesson"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn-ghost p-2 text-danger"
                    onClick={() => remove(l)}
                    aria-label="Delete lesson"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} title={editing ? 'Edit lesson' : 'Add lesson'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="l-title" className="label">Title</label>
            <input
              id="l-title"
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Lesson title"
            />
          </div>
          <div>
            <label htmlFor="l-type" className="label">Type</label>
            <select
              id="l-type"
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as LessonType })}
            >
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="l-dur" className="label">Duration (minutes)</label>
            <input
              id="l-dur"
              type="number"
              min={0}
              className="input"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="l-url" className="label">Video link (optional)</label>
            <input
              id="l-url"
              type="url"
              className="input"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Add lesson'}
          </button>
        </form>
      </Modal>
    </>
  );
}