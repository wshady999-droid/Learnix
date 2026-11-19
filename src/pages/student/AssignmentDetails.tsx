import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, FileText, Upload, CheckCircle2 } from 'lucide-react';
import { assignments } from '@/services/mockData';
import { useState } from 'react';

export default function AssignmentDetails() {
  const { assignmentId } = useParams();
  const assignment = assignments.find((a) => a.id === assignmentId);
  const [submitted, setSubmitted] = useState(false);

  if (!assignment) {
    return <EmptyState icon={<FileText size={26} />} title="Assignment not found" message="Go back to your assignments list." />;
  }

  return (
    <>
      <PageHeader
        title={assignment.title}
        subtitle={`${assignment.courseName} · ${assignment.points} points`}
        actions={<Link to="/student/assignments" className="btn-secondary"><ArrowLeft size={16} /> Back</Link>}
      />

      <div className="card p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: 'Due date', value: assignment.dueDate ?? '—' },
            { label: 'Status', value: submitted ? 'submitted' : assignment.status },
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
            Complete the work described in the title and submit before the due date. Attach your file below. Grading happens within a week of the deadline.
          </p>
        </div>

        {(assignment.status === 'pending' || submitted) ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={submitted}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            {submitted ? <><CheckCircle2 size={16} /> Submitted</> : <><Upload size={16} /> Submit work</>}
          </button>
        ) : (
          <button className="btn-secondary mt-6 w-full sm:w-auto">
            {assignment.status === 'graded' ? 'View grade' : 'Resubmit'}
          </button>
        )}
      </div>
    </>
  );
}
