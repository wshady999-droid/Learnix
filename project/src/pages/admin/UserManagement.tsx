import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { UserPlus, Pencil } from 'lucide-react';
import { users as seedUsers } from '@/services/mockData';
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

const filters = ['All', 'Students', 'Teachers', 'Admins'] as const;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'student' as User['role'] });

  const visible = useMemo(() => {
    const roleFilter = filter === 'All' ? null : filter.slice(0, -1).toLowerCase();
    return users.filter(
      (u) =>
        (!roleFilter || u.role === roleFilter) &&
        (u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()))
    );
  }, [users, query, filter]);

  const openAdd = () => {
    setForm({ name: '', email: '', role: 'student' });
    setEditing(null);
    setAddOpen(true);
  };

  const openEdit = (u: User) => {
    setForm({ name: u.name, email: u.email, role: u.role });
    setEditing(u);
    setAddOpen(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setUsers(users.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
    } else {
      setUsers([
        { id: `u${Date.now()}`, ...form, status: 'active', joinedAt: new Date().toISOString().slice(0, 10) },
        ...users,
      ]);
    }
    setAddOpen(false);
  };

  const toggleSuspend = (u: User) => {
    setUsers(users.map((x) => (x.id === u.id ? { ...x, status: x.status === 'suspended' ? 'active' : 'suspended' } : x)));
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={`${users.length} accounts on the platform.`}
        actions={<button className="btn-primary" onClick={openAdd}><UserPlus size={16} /> Add user</button>}
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search name or email..." onChange={setQuery} />
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}>
              <Badge variant={filter === f ? 'primary' : 'neutral'}>{f}</Badge>
            </button>
          ))}
        </div>
      </div>
      <DataTable
        data={visible}
        rowKey={(u) => u.id}
        emptyMessage="No users match your search."
        columns={[
          {
            key: 'name',
            header: 'User',
            render: (u) => (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {u.name.split(' ').map((p) => p[0]).join('')}
                </span>
                <div>
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
              </div>
            ),
          },
          { key: 'role', header: 'Role', render: (u) => <Badge variant={roleVariant[u.role]}>{u.role}</Badge> },
          { key: 'status', header: 'Status', render: (u) => <Badge variant={statusVariant[u.status]}>{u.status}</Badge> },
          { key: 'joined', header: 'Joined', render: (u) => <span className="text-muted">{u.joinedAt}</span> },
          {
            key: 'actions',
            header: 'Actions',
            render: (u) => (
              <div className="flex gap-2">
                <button className="btn-ghost text-xs" onClick={() => openEdit(u)}><Pencil size={13} /> Edit</button>
                <button className="btn-ghost text-xs text-danger" onClick={() => toggleSuspend(u)}>
                  {u.status === 'suspended' ? 'Restore' : 'Suspend'}
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={addOpen} title={editing ? 'Edit user' : 'Add user'} onClose={() => setAddOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="u-name" className="label">Name</label>
            <input id="u-name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div>
            <label htmlFor="u-email" className="label">Email</label>
            <input id="u-email" required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@learnix.io" />
          </div>
          <div>
            <label htmlFor="u-role" className="label">Role</label>
            <select id="u-role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Save changes' : 'Add user'}</button>
        </form>
      </Modal>
    </>
  );
}
