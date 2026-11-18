import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Plus, FileText, Upload } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { assignments } from '@/services/mockData';
import type { Assignment } from '@/types';

const statusVariant: Record<Assignment['status'], 'warning' | 'primary' | 'success' | 'danger'> = {
  pending: 'warning',
  submitted: 'primary',
  graded: 'success',
  overdue: 'danger',
};

export default function StudentAssignments() {
  return (
    <>
      <PageHeader title="Assignments" subtitle="Track, submit and review your coursework." />
      <DataTable
        data={assignments}
        rowKey={(a) => a.id}
        columns={[
          {
            key: 'title',
            header: 'Assignment',
            render: (a) => (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><FileText size={16} /></span>
                <div>
                  <p className="font-semibold text-ink">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.courseName}</p>
                </div>
              </div>
            ),
          },
          { key: 'due', header: 'Due', render: (a) => <span className="text-gray-500">{a.dueDate ?? '—'}</span> },
          { key: 'points', header: 'Points', render: (a) => <span className="font-medium text-ink">{a.points}</span> },
          { key: 'status', header: 'Status', render: (a) => <Badge variant={statusVariant[a.status]}>{a.status}</Badge> },
          {
            key: 'action',
            header: 'Action',
            render: (a) =>
              a.status === 'pending' ? (
                <button className="btn-primary py-2 text-xs"><Upload size={13} /> Submit</button>
              ) : a.status === 'graded' ? (
                <button className="btn-secondary py-2 text-xs">View grade</button>
              ) : (
                <button className="btn-ghost py-2 text-xs text-primary-600"><Plus size={13} /> Resubmit</button>
              ),
          },
        ]}
      />
    </>
  );
}
