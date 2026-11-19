import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Shield } from 'lucide-react';
import { useCatalog } from '@/store/catalog';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import type { User } from '@/types';

const statusVariant = { active: 'success', pending: 'warning', suspended: 'danger' } as const;
const roleVariant = { admin: 'warning', teacher: 'primary', student: 'neutral' } as const;

export default function UserDetails() {
  const { userId } = useParams();
  const { users, updateUser, courses } = useCatalog();
  const { toast, confirm } = useFeedback();
  const user = users.find((item) => item.id === userId);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', role: user?.role ?? 'student' });
  const [error, setError] = useState('');

  if (!user) {
    return <EmptyState icon={<Shield size={22} />} title="User not found" message="This account is not in the current demo catalog." />;
  }

  const taught = courses.filter((course) => course.instructorId === user.id);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === email && item.id !== user.id)) {
      setError('Another account already uses that email.');
      return;
    }
    updateUser(user.id, { name: form.name.trim(), email, role: form.role as User['role'] });
    setEditing(false);
    setError('');
    toast('User updated.');
  };

  const toggleSuspend = async () => {
    const restoring = user.status === 'suspended';
    const ok = await confirm({
      title: restoring ? 'Restore account' : 'Suspend account',
      message: restoring ? `${user.name} can sign in again.` : `${user.name} will be blocked from demo sign-in.`,
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
        title={user.name}
        subtitle={user.email}
        actions={<Link to="/admin/users" className="btn-secondary"><ArrowLeft size={16} /> All users</Link>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
            <Badge variant={statusVariant[user.status]}>{user.status}</Badge>
          </div>
          {editing ? (
            <form onSubmit={save} className="mt-5 space-y-4">
              <div>
                <label htmlFor="d-name" className="label">Name</label>
                <input id="d-name" required className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div>
                <label htmlFor="d-email" className="label">Email</label>
                <input id="d-email" required type="email" className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </div>
              <div>
                <label htmlFor="d-role" className="label">Role</label>
                <select id="d-role" className="input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as User['role'] })}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted">Email</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Role</dt>
                <dd className="mt-1 text-sm font-medium capitalize text-ink">{user.role}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Joined</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{user.joinedAt}</dd>
              </div>
            </dl>
          )}
          {!editing && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="btn-primary" onClick={() => { setForm({ name: user.name, email: user.email, role: user.role }); setEditing(true); }}>Edit user</button>
              <button type="button" className="btn-secondary" onClick={toggleSuspend}>{user.status === 'suspended' ? 'Restore account' : 'Suspend account'}</button>
            </div>
          )}
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink">Courses taught</h3>
          {user.role !== 'teacher' && <p className="mt-3 text-sm text-muted">Only teacher accounts are linked to courses.</p>}
          {user.role === 'teacher' && taught.length === 0 && <p className="mt-3 text-sm text-muted">No courses list this instructor.</p>}
          <ul className="mt-3 space-y-2">
            {taught.map((course) => (
              <li key={course.id}>
                <Link to={`/admin/courses/${course.id}`} className="text-sm font-medium text-ink hover:text-primary">{course.title}</Link>
                <p className="text-xs text-muted">{course.status} · {course.students} students</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
