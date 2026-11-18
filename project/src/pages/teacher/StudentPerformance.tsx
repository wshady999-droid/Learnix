import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { studentPerformance } from '@/services/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const radarData = studentPerformance.map((s) => ({ student: s.name.split(' ')[0], score: s.avgScore }));

export default function StudentPerformance() {
  return (
    <>
      <PageHeader title="Student Performance" subtitle="Compare scores, engagement and study time." />
      <div className="mb-5">
        <SearchInput placeholder="Search students..." />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {studentPerformance.map((s) => (
              <div key={s.id} className="card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary text-sm font-bold text-white">
                    {s.name.split(' ').map((p) => p[0]).join('')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                    <p className="truncate text-xs text-gray-400">{s.email}</p>
                  </div>
                  {s.trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
                  {s.trend === 'down' && <TrendingDown size={16} className="text-red-500" />}
                  {s.trend === 'flat' && <Minus size={16} className="text-gray-400" />}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Avg score', value: `${s.avgScore}%` },
                    { label: 'Lessons', value: String(s.completedLessons) },
                    { label: 'Study time', value: s.timeSpent },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl bg-gray-50 py-2.5">
                      <p className="text-sm font-bold text-ink">{m.value}</p>
                      <p className="text-[11px] text-gray-400">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Score</span>
                    <Badge variant={s.avgScore >= 85 ? 'success' : s.avgScore >= 70 ? 'warning' : 'danger'}>{s.avgScore}%</Badge>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary transition-all duration-700" style={{ width: `${s.avgScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card h-fit p-6">
          <h3 className="font-display text-base font-semibold text-ink">Class Comparison</h3>
          <p className="text-sm text-gray-500">Average score by student</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#EDEEF5" />
                <PolarAngleAxis dataKey="student" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Radar dataKey="score" name="Avg score" stroke="#5B5FEF" fill="#5B5FEF" fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EDEEF5' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
