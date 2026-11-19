import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Award } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { quizResults } from '@/services/mockData';
import type { QuizResult } from '@/types';

export default function QuizResults() {
  const avg = Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length);
  return (
    <>
      <PageHeader title="Results" subtitle={`Average score: ${avg}%.`} />
      <DataTable
        data={quizResults}
        rowKey={(r) => r.id}
        columns={[
          {
            key: 'quiz',
            header: 'Quiz',
            render: (r) => (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning"><Award size={16} /></span>
                <div>
                  <p className="font-semibold text-ink">{r.quizTitle}</p>
                  <p className="text-xs text-muted">{r.courseName}</p>
                </div>
              </div>
            ),
          },
          { key: 'score', header: 'Score', render: (r) => <span className="font-medium text-ink">{r.score} / {r.total}</span> },
          {
            key: 'percentage',
            header: 'Result',
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-soft">
                  <div className={`h-full rounded-full ${r.percentage >= 80 ? 'bg-success' : r.percentage >= 70 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${r.percentage}%` }} />
                </div>
                <span className="font-bold text-ink">{r.percentage}%</span>
              </div>
            ),
          },
          {
            key: 'grade',
            header: 'Grade',
            render: (r) => (
              <Badge variant={r.percentage >= 80 ? 'success' : r.percentage >= 70 ? 'warning' : 'danger'}>
                {r.percentage >= 90 ? 'Excellent' : r.percentage >= 80 ? 'Great' : r.percentage >= 70 ? 'Good' : 'Review'}
              </Badge>
            ),
          },
          { key: 'date', header: 'Date', render: (r) => <span className="text-muted">{r.completedAt}</span> },
        ]}
      />
    </>
  );
}
