import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { UserPlus } from 'lucide-react';
import { users } from '@/services/mockData';
import type { User } from '@/types';

const statusVariant: Record<User['status'], 'success' | 'warning' | 'danger'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
};

const roleVariant: Record<User['role'], 'primary' | 'warning' | 'neutral'> = {
  admin: 'warning',
  teacher: 'primary',
  student: 'neutral',
};

export default function UserManagement() {
  return (
    <>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} registered accounts on the platform.`}
        actions={
          <button className="btn-primary"><UserPlus size={16} /> Add user</button>
        }
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search by name, email or role..." />
        <div className="flex gap-2">
          <Badge variant="primary">All</Badge>
          <Badge>Students</Badge>
          <Badge>Teachers</Badge>
          <Badge>Admins</Badge>
        </div>
      </div>
      <DataTable
        data={users}
        rowKey={(u) => u.id}
        columns={[
          {
            key: 'name',
            header: 'User',
            render: (u) => (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary text-xs font-bold text-white">
                  {u.name.split(' ').map((p) => p[0]).join('')}
                </span>
                <div>
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
            ),
          },
          { key: 'role', header: 'Role', render: (u) => <Badge variant={roleVariant[u.role]} className="capitalize">{u.role}</Badge> },
          { key: 'status', header: 'Status', render: (u) => <Badge variant={statusVariant[u.status]}>{u.status}</Badge> },
          { key: 'joined', header: 'Joined', render: (u) => <span className="text-gray-500">{u.joinedAt}</span> },
          {
            key: 'actions',
            header: 'Actions',
            render: () => (
              <div className="flex gap-2">
                <button className="btn-ghost text-xs">Edit</button>
                <button className="btn-ghost text-xs text-red-500">Suspend</button>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
