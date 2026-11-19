import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <PageHeader title="Assignments" subtitle="Your coursework and due dates." />
      <DataTable
        data={assignments}
        rowKey={(a) => a.id}
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
          { key: 'due', header: 'Due', render: (a) => <span className="text-muted">{a.dueDate ?? '—'}</span> },
          { key: 'status', header: 'Status', render: (a) => <Badge variant={statusVariant[a.status]}>{a.status}</Badge> },
          {
            key: 'action',
            header: 'Action',
            render: (a) => (
              <Link to={`/student/assignments/${a.id}`} className="btn-primary py-2 text-xs">Open</Link>
            ),
          },
        ]}
      />
    </>
  );
}
