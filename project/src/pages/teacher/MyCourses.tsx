import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CourseCard } from '@/components/ui/CourseCard';
import { useAuth } from '@/context/AuthContext';
import { fetchTeacherCourses } from '@/services/teacher';
import type { Course } from '@/types';

export default function MyCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const name = profile.full_name || profile.email || 'You';
        const data = await fetchTeacherCourses(profile.id, name);
        if (!cancelled) setCourses(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your courses.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  return (
    <>
      <PageHeader
        title="My Courses"
        subtitle={loading ? 'Loading...' : `${courses.length} courses you teach.`}
        actions={
          <Link to="/teacher/courses/new" className="btn-primary">
            <Plus size={16} /> Create course
          </Link>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!loading && courses.length === 0 && !error ? (
        <div className="card p-8 text-center">
          <p className="font-display text-base font-semibold text-ink">No courses yet</p>
          <p className="mt-1 text-sm text-muted">Create your first course to get started.</p>
          <Link to="/teacher/courses/new" className="btn-primary mt-4 inline-flex">
            <Plus size={16} /> Create course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} href={`/teacher/courses/${c.id}`} />
          ))}
        </div>
      )}
    </>
  );
}