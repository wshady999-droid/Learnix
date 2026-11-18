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
      <PageHeader title="Quiz Results" subtitle={`Average score: ${avg}% across ${quizResults.length} attempts.`} />
      <DataTable
        data={quizResults}
        rowKey={(r) => r.id}
        columns={[
          {
            key: 'quiz',
            header: 'Quiz',
            render: (r) => (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500"><Award size={16} /></span>
                <div>
                  <p className="font-semibold text-ink">{r.quizTitle}</p>
                  <p className="text-xs text-gray-400">{r.courseName}</p>
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
                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${r.percentage >= 80 ? 'bg-emerald-500' : r.percentage >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${r.percentage}%` }} />
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
                {r.percentage >= 90 ? 'Excellent' : r.percentage >= 80 ? 'Great' : r.percentage >= 70 ? 'Good' : 'Needs review'}
              </Badge>
            ),
          },
          { key: 'date', header: 'Completed', render: (r) => <span className="text-gray-500">{r.completedAt}</span> },
        ]}
      />
    </>
  );
}
