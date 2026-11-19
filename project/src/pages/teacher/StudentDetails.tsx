import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, BookOpen, Clock, Trophy } from 'lucide-react';
import { studentPerformance, quizResults } from '@/services/mockData';

export default function StudentDetails() {
  const { studentId } = useParams();
  const student = studentPerformance.find((s) => s.id === studentId);

  if (!student) {
    return <EmptyState icon={<BookOpen size={26} />} title="Student not found" message="This student may have been removed." />;
  }

  return (
    <>
      <PageHeader
        title={student.name}
        subtitle={student.email}
        actions={<Link to="/teacher/students" className="btn-secondary"><ArrowLeft size={16} /> All students</Link>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { icon: Trophy, label: 'Average score', value: `${student.avgScore}%`, bg: 'bg-success/10', color: 'text-success' },
          { icon: BookOpen, label: 'Lessons done', value: String(student.completedLessons), bg: 'bg-primary-soft', color: 'text-primary' },
          { icon: Clock, label: 'Study time', value: student.timeSpent, bg: 'bg-warning/10', color: 'text-warning' },
        ].map((m) => (
          <div key={m.label} className="card p-6">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.bg} ${m.color}`}>
              <m.icon size={18} />
            </span>
            <p className="mt-3 font-display text-2xl font-bold text-ink">{m.value}</p>
            <p className="text-sm text-muted">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Recent quiz results</h3>
        <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
          {quizResults.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{r.quizTitle}</p>
                <p className="text-xs text-muted">{r.completedAt}</p>
              </div>
              <span className={`text-sm font-bold ${r.percentage >= 80 ? 'text-success' : r.percentage >= 70 ? 'text-warning' : 'text-danger'}`}>
                {r.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
