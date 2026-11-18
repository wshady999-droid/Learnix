import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Plus, FileText } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { assignments } from '@/services/mockData';
import type { Assignment } from '@/types';

const statusVariant: Record<Assignment['status'], 'warning' | 'primary' | 'success' | 'danger'> = {
  pending: 'warning',
  submitted: 'primary',
  graded: 'success',
  overdue: 'danger',
};

export default function Assignments() {
  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle="Track submissions and grading across your courses."
        actions={<button className="btn-primary"><Plus size={16} /> New assignment</button>}
      />
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
          { key: 'due', header: 'Due date', render: (a) => <span className="text-gray-500">{a.dueDate}</span> },
          {
            key: 'progress',
            header: 'Grading progress',
            render: (a) => (
              <div className="w-40">
                <p className="text-xs text-gray-500">{a.graded ?? 0} / {a.submissions ?? 0} graded</p>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary" style={{ width: `${a.submissions ? ((a.graded ?? 0) / a.submissions) * 100 : 0}%` }} />
                </div>
              </div>
            ),
          },
          { key: 'points', header: 'Points', render: (a) => <span className="font-medium text-ink">{a.points}</span> },
          { key: 'status', header: 'Status', render: (a) => <Badge variant={statusVariant[a.status]}>{a.status}</Badge> },
        ]}
      />
    </>
  );
}
