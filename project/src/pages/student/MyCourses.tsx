import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { CourseCard } from '@/components/ui/CourseCard';
import { useAuth } from '@/context/AuthContext';
import { fetchStudentOverview } from '@/services/courses';
import type { Course } from '@/types';

export default function MyCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;
    let active = true;
    fetchStudentOverview(profile.id)
      .then((ov) => {
        if (active) setCourses(ov.courses);
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

  return (
    <>
      <PageHeader
        title="My Courses"
        subtitle={loading ? 'Loading...' : `${courses.length} ${courses.length === 1 ? 'course' : 'courses'} enrolled.`}
        actions={<Link to="/student/browse" className="btn-primary">Browse courses</Link>}
      />
      {error && <p className="text-sm font-medium text-danger">Could not load courses: {error}</p>}
      {!loading && !error && courses.length === 0 && (
        <div className="card p-8 text-center">
          <p className="font-display text-base font-semibold text-ink">No courses yet</p>
          <p className="mt-1 text-sm text-muted">Browse the available courses and enroll in one to get started.</p>
          <Link to="/student/browse" className="btn-primary mt-4 inline-flex">Browse courses</Link>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} href={`/student/courses/${c.id}`} showProgress />
        ))}
      </div>
    </>
  );
}
