import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { Plus, ClipboardList, Clock, Users, Pencil } from 'lucide-react';
import { quizzes as seedQuizzes } from '@/services/mockData';
import type { Quiz } from '@/types';

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(seedQuizzes);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [form, setForm] = useState({ title: '', courseName: 'React Fundamentals', questions: 10, duration: 20 });

  const visible = useMemo(
    () => quizzes.filter((q) => q.title.toLowerCase().includes(query.toLowerCase()) || q.courseName.toLowerCase().includes(query.toLowerCase())),
    [quizzes, query]
  );

  const openAdd = () => {
    setForm({ title: '', courseName: 'React Fundamentals', questions: 10, duration: 20 });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (q: Quiz) => {
    setForm({ title: q.title, courseName: q.courseName, questions: q.questions, duration: q.duration });
    setEditing(q);
    setOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      setQuizzes(quizzes.map((q) => (q.id === editing.id ? { ...q, ...form } : q)));
    } else {
      setQuizzes([
        { id: `q${Date.now()}`, ...form, courseId: 'co1', attempts: 0, avgScore: 0, status: 'draft' },
        ...quizzes,
      ]);
    }
    setOpen(false);
  };

  const togglePublish = (q: Quiz) => {
    setQuizzes(quizzes.map((x) => (x.id === q.id ? { ...x, status: x.status === 'published' ? 'draft' : 'published' } : x)));
  };

  return (
    <>
      <PageHeader
        title="Quizzes"
        subtitle={`${quizzes.length} quizzes across your courses.`}
        actions={<button className="btn-primary" onClick={openAdd}><Plus size={16} /> New quiz</button>}
      />
      <div className="mb-5">
        <SearchInput placeholder="Search quizzes..." onChange={setQuery} />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {visible.map((q) => (
          <div key={q.id} className="card p-6 transition-colors hover:border-primary">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><ClipboardList size={18} /></span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{q.title}</h3>
                  <p className="text-xs text-muted">{q.courseName}</p>
                </div>
              </div>
              <Badge variant={q.status === 'published' ? 'success' : 'warning'}>{q.status}</Badge>
            </div>
            <div className="mt-5 flex items-center gap-5 text-sm text-muted">
              <span className="flex items-center gap-1.5"><ClipboardList size={14} /> {q.questions} questions</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {q.duration} min</span>
              <span className="flex items-center gap-1.5"><Users size={14} /> {q.attempts} attempts</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm text-muted">Average score</span>
              <span className="font-display text-base font-bold text-ink">{q.avgScore}%</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1 py-2 text-xs" onClick={() => openEdit(q)}><Pencil size={12} /> Edit</button>
              <button className="btn-ghost py-2 text-xs" onClick={() => togglePublish(q)}>
                {q.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title={editing ? 'Edit quiz' : 'New quiz'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="q-title" className="label">Title</label>
            <input id="q-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Quiz title" />
          </div>
          <div>
            <label htmlFor="q-course" className="label">Course</label>
            <select id="q-course" className="input" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })}>
              <option>React Fundamentals</option>
              <option>Advanced TypeScript Patterns</option>
              <option>Data Visualization with D3</option>
              <option>UX Design Essentials</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="q-qn" className="label">Questions</label>
              <input id="q-qn" type="number" min={1} max={50} className="input" value={form.questions} onChange={(e) => setForm({ ...form, questions: Number(e.target.value) })} />
            </div>
            <div>
              <label htmlFor="q-dur" className="label">Minutes</label>
              <input id="q-dur" type="number" min={5} max={120} className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Save changes' : 'Create quiz'}</button>
        </form>
      </Modal>
    </>
  );
}
