import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { PlayCircle, FileText, MousePointerClick, Plus, Pencil, Trash2 } from 'lucide-react';
import { lessons, courses } from '@/services/mockData';

const typeIcon = { video: PlayCircle, reading: FileText, interactive: MousePointerClick };

export default function LessonManagement() {
  const course = courses[0];
  return (
    <>
      <PageHeader
        title="Lesson Management"
        subtitle={course ? `${course.title} · ${lessons.length} lessons` : 'Manage your lesson library.'}
        actions={<button className="btn-primary"><Plus size={16} /> Add lesson</button>}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['#', 'Lesson', 'Type', 'Duration', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lessons.map((l) => {
                const Icon = typeIcon[l.type];
                return (
                  <tr key={l.id} className="transition-colors hover:bg-primary-50/30">
                    <td className="px-5 py-4 font-bold text-gray-300">{l.order}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon size={16} /></span>
                        <span className="font-medium text-ink">{l.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 capitalize">{l.type}</td>
                    <td className="px-5 py-4 text-gray-500">{l.duration}</td>
                    <td className="px-5 py-4"><Badge variant={l.completed ? 'success' : 'warning'}>{l.completed ? 'Published' : 'Draft'}</Badge></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button className="btn-ghost p-2" aria-label="Edit lesson"><Pencil size={14} /></button>
                        <button className="btn-ghost p-2 text-red-500" aria-label="Delete lesson"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
