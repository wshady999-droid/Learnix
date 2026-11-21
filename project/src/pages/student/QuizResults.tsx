import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { DataTable } from '@/components/ui/DataTable';
import { useAuth } from '@/context/AuthContext';
import { fetchQuizResults, type QuizResultRow } from '@/services/quizzes';

export default function QuizResults() {
  const { profile } = useAuth();
  const [results, setResults] = useState<QuizResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchQuizResults(profile.id);
        if (!cancelled) setResults(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your results.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  return (
    <>
      <PageHeader
        title="Results"
        subtitle={
          loading
            ? 'Loading...'
            : results.length
            ? `Average score: ${avg}%.`
            : 'No quiz attempts yet.'
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!loading && results.length === 0 && !error ? (
        <EmptyState
          icon={<Award size={26} />}
          title="No results yet"
          message="Take a quiz and your scores will show up here."
        />
      ) : (
        <DataTable
          data={results}
          rowKey={(r) => r.id}
          columns={[
            {
              key: 'quiz',
              header: 'Quiz',
              render: (r) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
                    <Award size={16} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{r.quizTitle}</p>
                    <p className="text-xs text-muted">{r.courseName}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'score',
              header: 'Score',
              render: (r) => (
                <span className="font-medium text-ink">
                  {r.score} / {r.total}
                </span>
              ),
            },
            {
              key: 'percentage',
              header: 'Result',
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-soft">
                    <div
                      className={`h-full rounded-full ${
                        r.percentage >= 80
                          ? 'bg-success'
                          : r.percentage >= 70
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                  <span className="font-bold text-ink">{r.percentage}%</span>
                </div>
              ),
            },
            {
              key: 'grade',
              header: 'Grade',
              render: (r) => (
                <Badge
                  variant={
                    r.percentage >= 80 ? 'success' : r.percentage >= 70 ? 'warning' : 'danger'
                  }
                >
                  {r.percentage >= 90
                    ? 'Excellent'
                    : r.percentage >= 80
                    ? 'Great'
                    : r.percentage >= 70
                    ? 'Good'
                    : 'Review'}
                </Badge>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              render: (r) => <span className="text-muted">{r.completedAt}</span>,
            },
          ]}
        />
      )}
    </>
  );
}