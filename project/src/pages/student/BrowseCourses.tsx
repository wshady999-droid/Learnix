import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { fetchBrowseCourses, enrollInCourse, type BrowseCourse } from '@/services/browse';

export default function BrowseCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<BrowseCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    let active = true;
    fetchBrowseCourses(profile.id)
      .then((list) => {
        if (active) setCourses(list);
      })
      .catch((e: any) => {
        if (active) setError(e?.message ?? 'Something went wrong');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [profile]);

  const handleEnroll = async (courseId: string) => {
    if (!profile) return;
    setBusyId(courseId);
    setError('');
    try {
      await enrollInCourse(courseId, profile.id);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, enrolled: true } : c)));
    } catch (e: any) {
      setError(e?.message ?? 'Could not enroll');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Browse Courses"
        subtitle={loading ? 'Loading...' : `${courses.length} ${courses.length === 1 ? 'course' : 'courses'} available.`}
        actions={<Link to="/student/courses" className="btn-ghost">My courses</Link>}
      />

      {error && <p className="mb-4 text-sm font-medium text-danger">{error}</p>}

      {loading && (
        <div className="flex justify-center py-20">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      )}

      {!loading && courses.length === 0 && !error && (
        <div className="card p-8 text-center">
          <p className="font-display text-base font-semibold text-ink">No courses available yet</p>
          <p className="mt-1 text-sm text-muted">Courses will show up here once teachers publish them.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="card flex flex-col overflow-hidden p-0">
            <div
              className="h-36 w-full"
              style={{
                background: c.thumbnail
                  ? `center / cover no-repeat url(${c.thumbnail})`
                  : 'linear-gradient(135deg, #E50914, #FF3038)',
              }}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{c.category}</span>
                <span>{c.level}</span>
              </div>
              <h3 className="mt-2 font-display text-base font-semibold text-ink">{c.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{c.description || 'No description yet.'}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>{c.instructor}</span>
                <span className="flex items-center gap-1">
                  <Star size={12} /> {c.rating.toFixed(1)}
                </span>
              </div>
              <div className="mt-4">
                {c.enrolled ? (
                  <Link to={`/student/courses/${c.id}`} className="btn-ghost w-full justify-center">
                    Open course
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(c.id)}
                    disabled={busyId === c.id}
                    className="btn-primary w-full"
                  >
                    {busyId === c.id ? 'Enrolling...' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
