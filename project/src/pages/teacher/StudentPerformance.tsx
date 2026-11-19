import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { studentPerformance } from '@/services/mockData';

export default function StudentPerformance() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const visible = useMemo(
    () => studentPerformance.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <>
      <PageHeader title="Students" subtitle="Scores and study time. Click a student for details." />
      <div className="mb-5">
        <SearchInput placeholder="Search students..." onChange={setQuery} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(`/teacher/students/${s.id}`)}
            className="card p-5 text-left transition-colors hover:border-primary"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {s.name.split(' ').map((p) => p[0]).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                <p className="truncate text-xs text-muted">{s.email}</p>
              </div>
              {s.trend === 'up' && <TrendingUp size={16} className="text-success" />}
              {s.trend === 'down' && <TrendingDown size={16} className="text-danger" />}
              {s.trend === 'flat' && <Minus size={16} className="text-muted" />}
              <ChevronRight size={16} className="text-muted" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Avg score', value: `${s.avgScore}%` },
                { label: 'Lessons', value: String(s.completedLessons) },
                { label: 'Study time', value: s.timeSpent },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-soft py-2.5">
                  <p className="text-sm font-bold text-ink">{m.value}</p>
                  <p className="text-[11px] text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
