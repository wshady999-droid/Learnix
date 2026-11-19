import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCatalog } from '@/store/catalog';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import type { Course } from '@/types';

const statusVariant = { published: 'success', draft: 'warning', archived: 'neutral' } as const;

export default function AdminCourseDetails() {
  const { courseId } = useParams();
  const { courses, lessons, updateCourse, categories } = useCatalog();
  const { toast, confirm } = useFeedback();
  const course = courses.find((item) => item.id === courseId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: course?.title ?? '',
    description: course?.description ?? '',
    category: course?.category ?? categories[0]?.name ?? 'Web Development',
    level: course?.level ?? 'Beginner' as Course['level'],
  });

  if (!course) {
    return <EmptyState icon={<BookOpen size={22} />} title="Course not found" message="This course is not in the current demo catalog." />;
  }

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    updateCourse(course.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      level: form.level,
    });
    setEditing(false);
    toast('Course updated.');
  };

  const setStatus = async (status: Course['status']) => {
    const ok = await confirm({
      title: status === 'archived' ? 'Archive course' : 'Publish course',
      message: status === 'archived'
        ? 'The course stays in the catalog and is marked archived.'
        : 'The course will be marked published in this session.',
      confirmLabel: status === 'archived' ? 'Archive' : 'Publish',
      danger: status === 'archived',
    });
    if (!ok) return;
    updateCourse(course.id, { status });
    toast(status === 'archived' ? 'Course archived.' : 'Course published.');
  };

  return (
    <>
      <PageHeader
        title={course.title}
        subtitle={`${course.instructor} · ${course.category}`}
        actions={<Link to="/admin/courses" className="btn-secondary"><ArrowLeft size={16} /> All courses</Link>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <Badge variant={statusVariant[course.status]}>{course.status}</Badge>
          {editing ? (
            <form onSubmit={save} className="mt-4 space-y-4">
              <div>
                <label htmlFor="ac-title" className="label">Title</label>
                <input id="ac-title" required className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </div>
              <div>
                <label htmlFor="ac-desc" className="label">Description</label>
                <textarea id="ac-desc" rows={3} className="input resize-none" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ac-cat" className="label">Category</label>
                  <select id="ac-cat" className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    {categories.map((category) => <option key={category.id}>{category.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ac-level" className="label">Level</label>
                  <select id="ac-level" className="input" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value as Course['level'] })}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">{course.description}</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div><dt className="text-xs text-muted">Students</dt><dd className="mt-1 text-sm font-medium text-ink">{course.students}</dd></div>
                <div><dt className="text-xs text-muted">Lessons</dt><dd className="mt-1 text-sm font-medium text-ink">{course.lessons}</dd></div>
                <div><dt className="text-xs text-muted">Level</dt><dd className="mt-1 text-sm font-medium text-ink">{course.level}</dd></div>
                <div><dt className="text-xs text-muted">Duration</dt><dd className="mt-1 text-sm font-medium text-ink">{course.duration}</dd></div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="btn-primary" onClick={() => setEditing(true)}>Edit course</button>
                {course.status === 'published'
                  ? <button type="button" className="btn-secondary" onClick={() => setStatus('archived')}>Archive</button>
                  : <button type="button" className="btn-secondary" onClick={() => setStatus('published')}>Publish</button>}
              </div>
            </>
          )}
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink">Lesson library</h3>
          <p className="mt-1 text-xs text-muted">Lessons are shared across the demo, not stored per course.</p>
          <ul className="mt-3 space-y-2">
            {(course.outline && course.outline.length > 0 ? course.outline.map((title, index) => ({ id: String(index), title })) : lessons).map((lesson) => (
              <li key={lesson.id} className="text-sm text-ink">{lesson.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
