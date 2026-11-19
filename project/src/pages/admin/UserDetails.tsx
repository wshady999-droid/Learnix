import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Mail, Calendar, Shield } from 'lucide-react';
import { users } from '@/services/mockData';

const statusVariant = { active: 'success', pending: 'warning', suspended: 'danger' } as const;
const roleVariant = { admin: 'warning', teacher: 'primary', student: 'neutral' } as const;

export default function UserDetails() {
  const { userId } = useParams();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return <EmptyState icon={<Shield size={26} />} title="User not found" message="This account may have been removed." />;
  }

  return (
    <>
      <PageHeader
        title={user.name}
        subtitle={user.email}
        actions={<Link to="/admin/users" className="btn-secondary"><ArrowLeft size={16} /> Back</Link>}
      />

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">
            {user.name.split(' ').map((p) => p[0]).join('')}
          </span>
          <div className="flex flex-wrap gap-2">
            <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
            <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
          </div>
        </div>

        <ul className="mt-6 divide-y" style={{ borderColor: 'var(--border)' }}>
          <li className="flex items-center gap-3 py-3 text-sm" style={{ borderColor: 'var(--border)' }}>
            <Mail size={16} className="text-muted" />
            <span className="text-muted">Email</span>
            <span className="ml-auto font-medium text-ink">{user.email}</span>
          </li>
          <li className="flex items-center gap-3 py-3 text-sm" style={{ borderColor: 'var(--border)' }}>
            <Shield size={16} className="text-muted" />
            <span className="text-muted">Role</span>
            <span className="ml-auto font-medium capitalize text-ink">{user.role}</span>
          </li>
          <li className="flex items-center gap-3 py-3 text-sm" style={{ borderColor: 'var(--border)' }}>
            <Calendar size={16} className="text-muted" />
            <span className="text-muted">Joined</span>
            <span className="ml-auto font-medium text-ink">{user.joinedAt}</span>
          </li>
        </ul>

        <div className="mt-6 flex gap-3">
          <button className="btn-primary flex-1 sm:flex-none">Edit user</button>
          <button className="btn-secondary flex-1 sm:flex-none text-danger">
            {user.status === 'suspended' ? 'Restore account' : 'Suspend account'}
          </button>
        </div>
      </div>
    </>
  );
}
