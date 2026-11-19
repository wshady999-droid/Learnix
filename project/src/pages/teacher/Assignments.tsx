import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, FileText, Upload } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { assignments as seed, courses } from '@/services/mockData';
import type { Assignment } from '@/types';

const statusVariant: Record<Assignment['status'], 'warning' | 'primary' | 'success' | 'danger'> = {
  pending: 'warning',
  submitted: 'primary',
  graded: 'success',
  overdue: 'danger',
};

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', courseName: 'React Fundamentals', dueDate: '', points: 100 });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    setAssignments([
      { id: `a${Date.now()}`, ...form, submissions: 0, totalStudents: 0, graded: 0, status: 'pending' },
      ...assignments,
    ]);
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle="Submissions and grading."
        actions={<button className="btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> New assignment</button>}
      />
      <DataTable
        data={assignments}
        rowKey={(a) => a.id}
        emptyMessage="No assignments yet."
        columns={[
          {
            key: 'title',
            header: 'Assignment',
            render: (a) => (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary"><FileText size={16} /></span>
                <div>
                  <p className="font-semibold text-ink">{a.title}</p>
                  <p className="text-xs text-muted">{a.courseName}</p>
                </div>
              </div>
            ),
          },
          { key: 'due', header: 'Due', render: (a) => <span className="text-muted">{a.dueDate}</span> },
          {
            key: 'progress',
            header: 'Graded',
            render: (a) => <span className="text-ink">{a.graded ?? 0} / {a.submissions ?? 0}</span>,
          },
          { key: 'status', header: 'Status', render: (a) => <Badge variant={statusVariant[a.status]}>{a.status}</Badge> },
        ]}
      />

      <Modal open={open} title="New assignment" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="a-title" className="label">Title</label>
            <input id="a-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" />
          </div>
          <div>
            <label htmlFor="a-course" className="label">Course</label>
            <select id="a-course" className="input" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })}>
              {courses.map((c) => <option key={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="a-due" className="label">Due date</label>
              <input id="a-due" required type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <label htmlFor="a-pts" className="label">Points</label>
              <input id="a-pts" type="number" min={10} max={200} className="input" value={form.points} onChange={(e) => setForm({ ...form, points: Number(e.target.value) })} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Create assignment</button>
        </form>
      </Modal>
    </>
  );
}
