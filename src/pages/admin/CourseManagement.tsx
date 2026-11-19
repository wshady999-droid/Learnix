import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { BookOpen, Plus } from 'lucide-react';
import { useCatalog } from '@/store/catalog';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import type { Course } from '@/types';

const statusVariant = { published: 'success', draft: 'warning', archived: 'neutral' } as const;
const statuses = ['All', 'Published', 'Draft', 'Archived'] as const;

export default function CourseManagement() {
  const { courses, categories, addCourse, updateCourse } = useCatalog();
  const { toast, confirm } = useFeedback();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('All');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: categories[0]?.name ?? 'Web Development', level: 'Beginner' as Course['level'] });

  const visible = useMemo(() => courses.filter((course) => {
    const matchesQuery = `${course.title} ${course.instructor}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'All' || course.status === status.toLowerCase();
    return matchesQuery && matchesStatus;
  }), [courses, query, status]);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    addCourse({
      id: `co${Date.now()}`,
      title: form.title.trim(),
      description: 'Draft course created in this session.',
      category: form.category,
      level: form.level,
      instructor: 'Unassigned',
      instructorId: '',
      students: 0,
      lessons: 0,
      duration: '0h',
      status: 'draft',
      rating: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      thumbnail: '',
    });
    setOpen(false);
    setForm({ title: '', category: categories[0]?.name ?? 'Web Development', level: 'Beginner' });
    toast('Draft course added.');
  };

  const toggleStatus = async (course: Course) => {
    const next: Course['status'] = course.status === 'published' ? 'archived' : 'published';
    const ok = await confirm({
      title: next === 'archived' ? 'Archive course' : 'Publish course',
      message: `${course.title} will be marked ${next}.`,
      confirmLabel: next === 'archived' ? 'Archive' : 'Publish',
      danger: next === 'archived',
    });
    if (!ok) return;
    updateCourse(course.id, { status: next });
    toast(next === 'archived' ? 'Course archived.' : 'Course published.');
  };

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle={`${courses.length} courses in the demo catalog.`}
        actions={<button type="button" className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> New course</button>}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search courses or instructors" onChange={setQuery} />
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button type="button" key={item} onClick={() => setStatus(item)}>
              <Badge variant={status === item ? 'primary' : 'neutral'}>{item}</Badge>
            </button>
          ))}
        </div>
      </div>
      {visible.length === 0 ? (
        <EmptyState icon={<BookOpen size={22} />} title="No courses found" message="Try another search or status." />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b bg-soft" style={{ borderColor: 'var(--border)' }}>
                {['Course', 'Instructor', 'Students', 'Status', ''].map((header) => (
                  <th key={header || 'actions'} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((course) => (
                <tr key={course.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <Link to={`/admin/courses/${course.id}`} className="font-medium text-ink hover:text-primary">{course.title}</Link>
                    <p className="text-xs text-muted">{course.category} · {course.level}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{course.instructor}</td>
                  <td className="px-4 py-3 text-ink">{course.students}</td>
                  <td className="px-4 py-3"><Badge variant={statusVariant[course.status]}>{course.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="btn-ghost px-2 text-xs" onClick={() => toggleStatus(course)}>
                      {course.status === 'published' ? 'Archive' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title="New course" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="c-title" className="label">Title</label>
            <input id="c-title" required className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div>
            <label htmlFor="c-cat" className="label">Category</label>
            <select id="c-cat" className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => <option key={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="c-level" className="label">Level</label>
            <select id="c-level" className="input" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value as Course['level'] })}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Create draft</button>
        </form>
      </Modal>
    </>
  );
}
