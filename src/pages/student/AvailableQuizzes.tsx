import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { ClipboardList, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { quizzes } from '@/services/mockData';

export default function AvailableQuizzes() {
  const available = quizzes.filter((q) => q.status === 'published');
  return (
    <>
      <PageHeader title="Quizzes" subtitle={`${available.length} quizzes ready.`} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {available.map((q) => (
          <div key={q.id} className="card p-6 transition-colors hover:border-primary">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><ClipboardList size={18} /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-semibold text-ink">{q.title}</h3>
                <p className="text-xs text-muted">{q.courseName}</p>
              </div>
              {q.dueDate && <Badge variant="warning">Due {q.dueDate}</Badge>}
            </div>
            <div className="mt-4 flex items-center gap-5 text-sm text-muted">
              <span className="flex items-center gap-1.5"><ClipboardList size={14} /> {q.questions} questions</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {q.duration} min</span>
            </div>
            <Link to={`/student/quizzes/${q.id}`} className="btn-primary mt-5 w-full"><PlayCircle size={16} /> Start</Link>
          </div>
        ))}
      </div>
    </>
  );
}
