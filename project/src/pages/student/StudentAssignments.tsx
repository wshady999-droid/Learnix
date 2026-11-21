import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { DataTable } from '@/components/ui/DataTable';
import { useAuth } from '@/context/AuthContext';
import {
  fetchStudentAssignments,
  type AssignmentRow,
  type AssignmentStatus,
} from '@/services/assignments';

const statusVariant: Record<AssignmentStatus, 'warning' | 'primary' | 'success' | 'danger'> = {
  pending: 'warning',
  submitted: 'primary',
  graded: 'success',
  overdue: 'danger',
};

export default function StudentAssignments() {
  const { profile } = useAuth();
  const [items, setItems] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchStudentAssignments(profile.id);
        if (!cancelled) setItems(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your assignments.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  return (
    <>
      <PageHeader title="Assignments" subtitle="Your coursework and due dates." />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : items.length === 0 && !error ? (
        <EmptyState
          icon={<FileText size={26} />}
          title="No assignments yet"
          message="Assignments from the courses you are enrolled in will show up here."
        />
      ) : (
        <DataTable
          data={items}
          rowKey={(a) => a.id}
          columns={[
            {
              key: 'title',
              header: 'Assignment',
              render: (a) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <FileText size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{a.title}</p>
                    <p className="text-xs text-muted">{a.courseName}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'due',
              header: 'Due',
              render: (a) => <span className="text-muted">{a.dueDate || '-'}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (a) => <Badge variant={statusVariant[a.status]}>{a.status}</Badge>,
            },
            {
              key: 'action',
              header: 'Action',
              render: (a) => (
                <Link to={`/student/assignments/${a.id}`} className="btn-primary py-2 text-xs">
                  Open
                </Link>
              ),
            },
          ]}
        />
      )}
    </>
  );
}