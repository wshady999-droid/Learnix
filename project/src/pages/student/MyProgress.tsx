import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Trophy, Clock, CheckCircle2, Flame } from 'lucide-react';
import { lessons, courses, quizResults } from '@/services/mockData';

export default function MyProgress() {
  const completed = lessons.filter((l) => l.completed).length;
  const completionRate = Math.round((completed / lessons.length) * 100);
  const avgScore = Math.round(quizResults.reduce((s, r) => s + r.percentage, 0) / quizResults.length);

  return (
    <>
      <PageHeader title="My Progress" subtitle="How you're doing overall." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completion" value={`${completionRate}%`} change="+6% this week" changeType="up" icon={CheckCircle2} iconBg="bg-success/10" iconColor="text-success" />
        <StatCard label="Study time" value="20.3h" change="This week" changeType="flat" icon={Clock} iconBg="bg-primary-soft" iconColor="text-primary" />
        <StatCard label="Quiz average" value={`${avgScore}%`} change={`${quizResults.length} quizzes`} changeType="up" icon={Trophy} iconBg="bg-warning/10" iconColor="text-warning" />
        <StatCard label="Streak" value="6 days" change="Best: 9 days" changeType="up" icon={Flame} iconBg="bg-danger/10" iconColor="text-danger" />
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Course progress</h3>
        <p className="text-sm text-muted">Each course you're enrolled in</p>
        <ul className="mt-5 space-y-5">
          {courses.filter((c) => c.progress !== undefined).map((c) => (
            <li key={c.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-ink">{c.title}</span>
                <span className="font-bold text-ink">{c.progress}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-soft">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${c.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
