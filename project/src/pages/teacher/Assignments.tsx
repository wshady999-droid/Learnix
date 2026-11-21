import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/DataTable';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchTeacherCourseOptions, type CourseOption } from '@/services/courseManagement';
import {
  createAssignment,
  fetchSubmissions,
  fetchTeacherAssignments,
  gradeSubmission,
  type SubmissionRowData,
  type TeacherAssignment,
} from '@/services/teacherAssignments';

function SubmissionRow({
  submission,
  maxPoints,
  onSaved,
}: {
  submission: SubmissionRowData;
  maxPoints: number;
  onSaved: () => void;
}) {
  const [grade, setGrade] = useState(submission.grade === null ? '' : String(submission.grade));
  const [feedback, setFeedback] = useState(submission.feedback);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  const save = async () => {
    const value = Number(grade);
    if (grade.trim() === '' || Number.isNaN(value) || value < 0 || value > maxPoints) {
      setFailed(true);
      setMessage(`Enter a grade between 0 and ${maxPoints}.`);
      return;
    }
    try {
      setSaving(true);
      setMessage('');
      await gradeSubmission(submission.id, value, feedback.trim());
      setFailed(false);
      setMessage('Saved');
      onSaved();
    } catch (e: any) {
      setFailed(true);
      setMessage(e?.message ?? 'Could not save the grade.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="rounded-xl border p-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{submission.studentName}</p>
          <p className="truncate text-xs text-muted">
            {submission.studentEmail} - submitted {submission.submittedAt}
          </p>
        </div>
        {submission.fileUrl && (
          <a
            href={submission.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:opacity-80"
          >
            Open work
          </a>
        )}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <label className="label">Grade / {maxPoints}</label>
          <input
            type="number"
            min={0}
            max={maxPoints}
            className="input"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3">
          <label className="label">Feedback</label>
          <input
            className="input"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional feedback"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button className="btn-primary py-2 text-xs" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save grade'}
        </button>
        {message && (
          <span className={`text-xs ${failed ? 'text-danger' : 'text-success'}`}>{message}</span>
        )}
      </div>
    </li>
  );
}

export default function Assignments() {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    courseId: '',
    description: '',
    dueDate: '',
    points: '100',
  });

  const [gradeOpen, setGradeOpen] = useState(false);
  const [active, setActive] = useState<TeacherAssignment | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRowData[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState('');

  const load = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setError('');
      const [a, c] = await Promise.all([
        fetchTeacherAssignments(profile.id),
        fetchTeacherCourseOptions(profile.id),
      ]);
      setAssignments(a);
      setCourses(c);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load your assignments.');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm({ title: '', courseId: courses[0]?.id ?? '', description: '', dueDate: '', points: '100' });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    if (!form.courseId) {
      setError('Create a course first, then add an assignment to it.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await createAssignment({
        courseId: form.courseId,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        points: Math.max(1, parseInt(form.points, 10) || 100),
      });
      setOpen(false);
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Could not create the assignment.');
    } finally {
      setSaving(false);
    }
  };

  const loadSubmissions = async (assignmentId: string) => {
    try {
      setSubError('');
      setSubmissions(await fetchSubmissions(assignmentId));
    } catch (e: any) {
      setSubError(e?.message ?? 'Could not load submissions.');
    }
  };

  const openGrade = async (a: TeacherAssignment) => {
    setActive(a);
    setSubmissions([]);
    setGradeOpen(true);
    setSubLoading(true);
    await loadSubmissions(a.id);
    setSubLoading(false);
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle="Submissions and grading."
        actions={
          <button className="btn-primary" onClick={openNew}>
            <Plus size={16} /> New assignment
          </button>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <DataTable
        data={assignments}
        rowKey={(a) => a.id}
        emptyMessage="No assignments yet."
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
          { key: 'due', header: 'Due', render: (a) => <span className="text-muted">{a.dueDate || '-'}</span> },
          {
            key: 'progress',
            header: 'Graded',
            render: (a) => (
              <span className="text-ink">
                {a.graded} / {a.submissions}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (a) => (
              <Badge variant={a.isClosed ? 'danger' : 'success'}>{a.isClosed ? 'closed' : 'open'}</Badge>
            ),
          },
          {
            key: 'action',
            header: 'Action',
            render: (a) => (
              <button className="btn-primary py-2 text-xs" onClick={() => openGrade(a)}>
                Grade
              </button>
            ),
          },
        ]}
      />

      <Modal open={open} title="New assignment" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="a-title" className="label">Title</label>
            <input
              id="a-title"
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Assignment title"
            />
          </div>
          <div>
            <label htmlFor="a-course" className="label">Course</label>
            <select
              id="a-course"
              className="input"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            >
              {courses.length === 0 && <option value="">No courses yet</option>}
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="a-desc" className="label">Instructions</label>
            <textarea
              id="a-desc"
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What should students do?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="a-due" className="label">Due date</label>
              <input
                id="a-due"
                required
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="a-pts" className="label">Points</label>
              <input
                id="a-pts"
                type="number"
                min={1}
                max={1000}
                className="input"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Create assignment'}
          </button>
        </form>
      </Modal>

      <Modal
        open={gradeOpen}
        title={active ? `Grade: ${active.title}` : 'Grade'}
        onClose={() => setGradeOpen(false)}
      >
        {subError && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {subError}
          </div>
        )}
        {subLoading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-muted">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {submissions.map((s) => (
              <SubmissionRow
                key={s.id}
                submission={s}
                maxPoints={active?.points ?? 100}
                onSaved={() => {
                  load();
                }}
              />
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
}