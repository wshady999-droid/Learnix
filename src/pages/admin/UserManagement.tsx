import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { UserPlus, Pencil } from 'lucide-react';
import { useCatalog } from '@/store/catalog';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import type { User } from '@/types';

const statusVariant = { active: 'success', pending: 'warning', suspended: 'danger' } as const;
const roleVariant = { admin: 'warning', teacher: 'primary', student: 'neutral' } as const;
const filters = ['All', 'Students', 'Teachers', 'Admins'] as const;

const emptyForm = { name: '', email: '', role: 'student' as User['role'] };

export default function UserManagement() {
  const { users, addUser, updateUser } = useCatalog();
  const { toast, confirm } = useFeedback();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const visible = useMemo(() => {
    const roleFilter = filter === 'All' ? null : filter.slice(0, -1).toLowerCase();
    return users.filter((user) =>
      (!roleFilter || user.role === roleFilter) &&
      (`${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()))
    );
  }, [users, query, filter]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setError('');
    setOpen(true);
  };

  const openEdit = (user: User) => {
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditing(user);
    setError('');
    setOpen(true);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name || !email) return;
    const duplicate = users.some((user) => user.email.toLowerCase() === email && user.id !== editing?.id);
    if (duplicate) {
      setError('Another account already uses that email.');
      return;
    }
    if (editing) {
      updateUser(editing.id, { name, email, role: form.role });
      toast('User updated.');
    } else {
      addUser({ name, email, role: form.role });
      toast('User added to this session.');
    }
    setOpen(false);
  };

  const toggleSuspend = async (user: User) => {
    const restoring = user.status === 'suspended';
    const ok = await confirm({
      title: restoring ? 'Restore account' : 'Suspend account',
      message: restoring
        ? `${user.name} will be able to sign in to the demo again.`
        : `${user.name} will be blocked from demo sign-in until restored.`,
      confirmLabel: restoring ? 'Restore' : 'Suspend',
      danger: !restoring,
    });
    if (!ok) return;
    updateUser(user.id, { status: restoring ? 'active' : 'suspended' });
    toast(restoring ? 'Account restored.' : 'Account suspended.');
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={`${users.length} accounts in the demo catalog.`}
        actions={<button type="button" className="btn-primary" onClick={openAdd}><UserPlus size={16} /> Add user</button>}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search name or email" onChange={setQuery} />
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button type="button" key={item} onClick={() => setFilter(item)}>
              <Badge variant={filter === item ? 'primary' : 'neutral'}>{item}</Badge>
            </button>
          ))}
        </div>
      </div>
      <DataTable
        data={visible}
        rowKey={(user) => user.id}
        emptyMessage="No users match this search."
        columns={[
          {
            key: 'name',
            header: 'User',
            sortValue: (user) => user.name,
            render: (user) => (
              <div>
                <Link to={`/admin/users/${user.id}`} className="font-medium text-ink hover:text-primary">{user.name}</Link>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            ),
          },
          { key: 'role', header: 'Role', sortValue: (user) => user.role, render: (user) => <Badge variant={roleVariant[user.role]}>{user.role}</Badge> },
          { key: 'status', header: 'Status', sortValue: (user) => user.status, render: (user) => <Badge variant={statusVariant[user.status]}>{user.status}</Badge> },
          { key: 'joined', header: 'Joined', sortValue: (user) => user.joinedAt, render: (user) => <span className="text-muted">{user.joinedAt}</span> },
          {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
              <div className="flex gap-1">
                <button type="button" className="btn-ghost px-2 text-xs" onClick={() => openEdit(user)}><Pencil size={13} /> Edit</button>
                <button type="button" className="btn-ghost px-2 text-xs text-danger" onClick={() => toggleSuspend(user)}>
                  {user.status === 'suspended' ? 'Restore' : 'Suspend'}
                </button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={open} title={editing ? 'Edit user' : 'Add user'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="u-name" className="label">Name</label>
            <input id="u-name" required className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div>
            <label htmlFor="u-email" className="label">Email</label>
            <input id="u-email" required type="email" className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div>
            <label htmlFor="u-role" className="label">Role</label>
            <select id="u-role" className="input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as User['role'] })}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full">{editing ? 'Save changes' : 'Add user'}</button>
        </form>
      </Modal>
    </>
  );
}
