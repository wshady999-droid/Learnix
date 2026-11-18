import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Plus, ClipboardList, Clock, Users, Target } from 'lucide-react';
import { quizzes } from '@/services/mockData';

export default function QuizManagement() {
  return (
    <>
      <PageHeader
        title="Quiz Management"
        subtitle={`${quizzes.length} quizzes across your courses.`}
        actions={<button className="btn-primary"><Plus size={16} /> Create quiz</button>}
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {quizzes.map((q) => (
          <div key={q.id} className="card p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><ClipboardList size={20} /></span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{q.title}</h3>
                  <p className="text-xs text-gray-400">{q.courseName}</p>
                </div>
              </div>
              <Badge variant={q.status === 'published' ? 'success' : 'warning'}>{q.status}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: ClipboardList, label: 'Questions', value: String(q.questions) },
                { icon: Clock, label: 'Duration', value: `${q.duration}m` },
                { icon: Users, label: 'Attempts', value: String(q.attempts) },
                { icon: Target, label: 'Avg. Score', value: `${q.avgScore}%` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl bg-gray-50 p-3">
                  <Icon size={15} className="text-gray-400" />
                  <p className="mt-1.5 text-sm font-bold text-ink">{value}</p>
                  <p className="text-[11px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
              <button className="btn-secondary flex-1 py-2 text-xs">View results</button>
              <button className="btn-ghost py-2 text-xs">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
