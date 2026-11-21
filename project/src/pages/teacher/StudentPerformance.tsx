import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChevronRight, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchTeacherStudents, type TeacherStudent } from '@/services/teacherStudents';

export default function StudentPerformance() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTeacherStudents(profile.id);
        if (!cancelled) setStudents(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your students.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const visible = useMemo(
    () =>
      students.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.email.toLowerCase().includes(query.toLowerCase())
      ),
    [students, query]
  );

  return (
    <>
      <PageHeader title="Students" subtitle="Scores and study time. Click a student for details." />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mb-5">
        <SearchInput placeholder="Search students..." onChange={setQuery} />
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : students.length === 0 && !error ? (
        <EmptyState
          icon={<Users size={26} />}
          title="No students yet"
          message="Students who enroll in your courses will show up here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/teacher/students/${s.id}`)}
              className="card p-5 text-left transition-colors hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {s.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                  <p className="truncate text-xs text-muted">{s.email}</p>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Avg score', value: s.attempts > 0 ? `${s.avgScore}%` : '-' },
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
      )}
    </>
  );
}