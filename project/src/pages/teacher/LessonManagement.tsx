import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PlayCircle, FileText, MousePointerClick, Plus, Pencil, Trash2 } from 'lucide-react';
import { lessons as seedLessons, courses } from '@/services/mockData';
import type { Lesson } from '@/types';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

export default function LessonManagement() {
  const [lessons, setLessons] = useState<Lesson[]>(seedLessons);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [form, setForm] = useState({ title: '', type: 'video' as Lesson['type'], duration: '20 min' });
  const course = courses[0];

  const openAdd = () => {
    setForm({ title: '', type: 'video', duration: '20 min' });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (l: Lesson) => {
    setForm({ title: l.title, type: l.type, duration: l.duration });
    setEditing(l);
    setOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      setLessons(lessons.map((l) => (l.id === editing.id ? { ...l, ...form } : l)));
    } else {
      setLessons([...lessons, { id: `l${Date.now()}`, order: lessons.length + 1, completed: false, ...form }]);
    }
    setOpen(false);
  };

  const remove = (l: Lesson) => setLessons(lessons.filter((x) => x.id !== l.id));

  return (
    <>
      <PageHeader
        title="Lessons"
        subtitle={course ? `${course.title} · ${lessons.length} lessons` : 'Your lesson list.'}
        actions={<button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add lesson</button>}
      />

      <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
        {lessons.map((l) => {
          const Icon = typeIcon[l.type];
          return (
            <div key={l.id} className="flex items-center gap-4 p-5" style={{ borderColor: 'var(--border)' }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{l.title}</p>
                <p className="text-xs text-muted capitalize">{l.type} · {l.duration}</p>
              </div>
              <Badge variant={l.completed ? 'success' : 'warning'}>{l.completed ? 'Published' : 'Draft'}</Badge>
              <div className="flex gap-1">
                <button className="btn-ghost p-2" onClick={() => openEdit(l)} aria-label="Edit lesson"><Pencil size={14} /></button>
                <button className="btn-ghost p-2 text-danger" onClick={() => remove(l)} aria-label="Delete lesson"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} title={editing ? 'Edit lesson' : 'Add lesson'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="l-title" className="label">Title</label>
            <input id="l-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Lesson title" />
          </div>
          <div>
            <label htmlFor="l-type" className="label">Type</label>
            <select id="l-type" className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Lesson['type'] })}>
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="interactive">Interactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="l-dur" className="label">Duration</label>
            <input id="l-dur" className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 20 min" />
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Save changes' : 'Add lesson'}</button>
        </form>
      </Modal>
    </>
  );
}
