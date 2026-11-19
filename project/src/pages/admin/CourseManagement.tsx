import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { BookOpen, Plus, Star, Users, Pencil } from 'lucide-react';
import { courses as seedCourses } from '@/services/mockData';
import type { Course } from '@/types';

const statusVariant = { published: 'success', draft: 'warning', archived: 'neutral' } as const;

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(seedCourses);
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Web Development', level: 'Beginner' as Course['level'] });

  const visible = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.instructor.toLowerCase().includes(query.toLowerCase())
      ),
    [courses, query]
  );

  const openAdd = () => {
    setForm({ title: '', category: 'Web Development', level: 'Beginner' });
    setEditing(null);
    setAddOpen(true);
  };

  const openEdit = (c: Course) => {
    setForm({ title: c.title, category: c.category, level: c.level });
    setEditing(c);
    setAddOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      setCourses(courses.map((c) => (c.id === editing.id ? { ...c, ...form } : c)));
    } else {
      setCourses([
        {
          id: `co${Date.now()}`,
          ...form,
          description: 'New course — description coming soon.',
          instructor: 'Unassigned',
          instructorId: 'u2',
          students: 0,
          lessons: 0,
          duration: '0h',
          status: 'draft',
          rating: 0,
          createdAt: new Date().toISOString().slice(0, 10),
          thumbnail: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=640',
        },
        ...courses,
      ]);
    }
    setAddOpen(false);
  };

  const toggleStatus = (c: Course) => {
    const next: Course['status'] = c.status === 'published' ? 'archived' : 'published';
    setCourses(courses.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
  };

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle="All courses on the platform."
        actions={<button className="btn-primary" onClick={openAdd}><Plus size={16} /> New course</button>}
      />
      <div className="mb-5">
        <SearchInput placeholder="Search courses or instructors..." onChange={setQuery} />
      </div>
      {visible.length === 0 ? (
        <EmptyState icon={<BookOpen size={26} />} title="No courses found" message="Try a different search." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => (
            <div key={c.id} className="card group overflow-hidden transition-colors hover:border-primary">
              <div className="relative h-36">
                <img src={c.thumbnail} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute right-3 top-3"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-ink">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{c.instructor} · {c.category}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><Users size={13} /> {c.students}</span>
                  <span className="flex items-center gap-1 font-medium text-warning"><Star size={13} fill="currentColor" /> {c.rating}</span>
                  <span>{c.lessons} lessons</span>
                </div>
                <div className="mt-4 flex gap-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <button className="btn-secondary flex-1 py-2 text-xs" onClick={() => openEdit(c)}><Pencil size={12} /> Edit</button>
                  <button className="btn-ghost py-2 text-xs" onClick={() => toggleStatus(c)}>
                    {c.status === 'published' ? 'Archive' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} title={editing ? 'Edit course' : 'New course'} onClose={() => setAddOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="c-title" className="label">Title</label>
            <input id="c-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Course title" />
          </div>
          <div>
            <label htmlFor="c-cat" className="label">Category</label>
            <select id="c-cat" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Web Development</option><option>Data Science</option><option>Design</option><option>Business</option><option>Marketing</option>
            </select>
          </div>
          <div>
            <label htmlFor="c-level" className="label">Level</label>
            <select id="c-level" className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Course['level'] })}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Save changes' : 'Create course'}</button>
        </form>
      </Modal>
    </>
  );
}
