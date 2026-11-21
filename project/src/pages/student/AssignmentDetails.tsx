import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAssignmentDetail,
  submitAssignment,
  type AssignmentDetail,
} from '@/services/assignments';

export default function AssignmentDetails() {
  const { assignmentId } = useParams();
  const { profile } = useAuth();
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [link, setLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!assignmentId || !profile?.id) return;
    try {
      const data = await fetchAssignmentDetail(assignmentId, profile.id);
      setAssignment(data);
      if (data?.fileUrl) setLink(data.fileUrl);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load this assignment.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId, profile?.id]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  async function handleSubmit() {
    if (!assignmentId || !profile?.id) return;
    const value = link.trim();
    if (!/^https?:\/\/.+/i.test(value)) {
      setError('Please paste a valid link that starts with http:// or https://');
      return;
    }
    try {
      setSaving(true);
      setError('');
      setSaved(false);
      await submitAssignment(assignmentId, profile.id, value);
      setSaved(true);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Could not submit your work.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!assignment) {
    return (
      <EmptyState
        icon={<FileText size={26} />}
        title="Assignment not found"
        message={error || 'Go back to your assignments list.'}
      />
    );
  }

  const isGraded = assignment.status === 'graded';

  return (
    <>
      <PageHeader
        title={assignment.title}
        subtitle={`${assignment.courseName} - ${assignment.points} points`}
        actions={
          <Link to="/student/assignments" className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />

      <div className="card p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: 'Due date', value: assignment.dueDate || '-' },
            { label: 'Status', value: assignment.status },
            { label: 'Points', value: String(assignment.points) },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-soft p-4 text-center">
              <p className="text-sm font-bold capitalize text-ink">{m.value}</p>
              <p className="text-xs text-muted">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-soft p-5">
          <h3 className="font-display text-sm font-semibold text-ink">Instructions</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {assignment.description || 'No instructions were added for this assignment.'}
          </p>
        </div>

        {isGraded && (
          <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-5">
            <h3 className="font-display text-sm font-semibold text-ink">Your grade</h3>
            <p className="mt-2 font-display text-3xl font-bold text-success">
              {assignment.grade} / {assignment.points}
            </p>
            {assignment.feedback && (
              <p className="mt-2 text-sm text-muted">Feedback: {assignment.feedback}</p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {assignment.hasSubmission && (
          <p className="mt-6 text-sm text-muted">
            Submitted on {assignment.submittedAt}
            {assignment.fileUrl && (
              <>
                {' - '}
                <a
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary hover:opacity-80"
                >
                  Open your work
                </a>
              </>
            )}
          </p>
        )}

        {!isGraded ? (
          <div className="mt-6">
            <label className="label" htmlFor="work-link">
              Link to your work (Google Drive, GitHub, ...)
            </label>
            <input
              id="work-link"
              className="input"
              type="url"
              placeholder="https://..."
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                setSaved(false);
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={saving || !link.trim()}
              className="btn-primary mt-4 w-full sm:w-auto"
            >
              {saving ? (
                'Saving...'
              ) : saved ? (
                <>
                  <CheckCircle2 size={16} /> Submitted
                </>
              ) : (
                <>
                  <Upload size={16} /> {assignment.hasSubmission ? 'Resubmit work' : 'Submit work'}
                </>
              )}
            </button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">This assignment has been graded.</p>
        )}
      </div>
    </>
  );
}