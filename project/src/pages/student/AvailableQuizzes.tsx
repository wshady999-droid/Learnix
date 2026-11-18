import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { ClipboardList, Clock, PlayCircle } from 'lucide-react';
import { quizzes } from '@/services/mockData';

export default function AvailableQuizzes() {
  const available = quizzes.filter((q) => q.status === 'published');
  return (
    <>
      <PageHeader title="Available Quizzes" subtitle={`${available.length} quizzes ready to attempt.`} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {available.map((q) => (
          <div key={q.id} className="card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><ClipboardList size={20} /></span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-semibold text-ink">{q.title}</h3>
                <p className="text-xs text-gray-400">{q.courseName}</p>
              </div>
              {q.dueDate && <Badge variant="warning">Due {q.dueDate}</Badge>}
            </div>
            <div className="mt-5 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><ClipboardList size={13} /> {q.questions} questions</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {q.duration} minutes</span>
            </div>
            <button className="btn-primary mt-5 w-full"><PlayCircle size={16} /> Start quiz</button>
          </div>
        ))}
      </div>
    </>
  );
}
