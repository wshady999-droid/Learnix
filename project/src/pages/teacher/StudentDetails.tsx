import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, BookOpen, Clock, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchStudentDetail, type StudentDetail } from '@/services/teacherStudentDetails';

export default function StudentDetails() {
  const { studentId } = useParams();
  const { profile } = useAuth();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id || !studentId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchStudentDetail(profile.id, studentId);
        if (!cancelled) setStudent(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load this student.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id, studentId]);

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!student) {
    return (
      <EmptyState
        icon={<BookOpen size={26} />}
        title="Student not found"
        message={error || 'This student is not enrolled in any of your courses.'}
      />
    );
  }

  const stats = [
    {
      icon: Trophy,
      label: 'Average score',
      value: student.attempts > 0 ? `${student.avgScore}%` : '-',
      bg: 'bg-success/10',
      color: 'text-success',
    },
    {
      icon: BookOpen,
      label: 'Lessons done',
      value: String(student.completedLessons),
      bg: 'bg-primary-soft',
      color: 'text-primary',
    },
    {
      icon: Clock,
      label: 'Study time',
      value: student.timeSpent,
      bg: 'bg-warning/10',
      color: 'text-warning',
    },
  ];

  return (
    <>
      <PageHeader
        title={student.name}
        subtitle={student.email}
        actions={
          <Link to="/teacher/students" className="btn-secondary">
            <ArrowLeft size={16} /> All students
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((m) => (
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
        <h3 className="font-display text-base font-semibold text-ink">Course progress</h3>
        {student.courses.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Not enrolled in any of your courses.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {student.courses.map((c) => (
              <li key={c.courseId}>
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-ink">{c.title}</p>
                  <span className="text-xs text-muted">
                    {c.completedLessons} / {c.totalLessons} lessons - {c.percent}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card mt-6 p-6">
        <h3 className="font-display text-base font-semibold text-ink">Recent quiz results</h3>
        {student.results.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No quiz attempts yet.</p>
        ) : (
          <ul className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
            {student.results.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-4 py-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{r.quizTitle}</p>
                  <p className="text-xs text-muted">
                    {r.courseName} - {r.date}
                  </p>
                </div>
                <span
                  className={`text-sm font-bold ${
                    r.percentage >= 80
                      ? 'text-success'
                      : r.percentage >= 70
                      ? 'text-warning'
                      : 'text-danger'
                  }`}
                >
                  {r.percentage}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}