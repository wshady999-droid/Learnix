import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, PlayCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchAvailableQuizzes, type QuizSummary } from '@/services/quizzes';

export default function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAvailableQuizzes();
        if (!cancelled) setQuizzes(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load quizzes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Quizzes"
        subtitle={loading ? 'Loading...' : `${quizzes.length} quizzes ready.`}
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!loading && quizzes.length === 0 && !error ? (
        <EmptyState
          icon={<ClipboardList size={26} />}
          title="No quizzes yet"
          message="Quizzes from the courses you are enrolled in will show up here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {quizzes.map((q) => (
            <div key={q.id} className="card p-6 transition-colors hover:border-primary">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <ClipboardList size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-semibold text-ink">{q.title}</h3>
                  <p className="text-xs text-muted">{q.courseName}</p>
                </div>
                {q.dueDate && <Badge variant="warning">Due {q.dueDate}</Badge>}
              </div>
              <div className="mt-4 flex items-center gap-5 text-sm text-muted">
                {q.questionCount !== null && (
                  <span className="flex items-center gap-1.5">
                    <ClipboardList size={14} /> {q.questionCount} questions
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {q.durationMinutes} min
                </span>
              </div>
              <Link to={`/student/quizzes/${q.id}`} className="btn-primary mt-5 w-full">
                <PlayCircle size={16} /> Start
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}