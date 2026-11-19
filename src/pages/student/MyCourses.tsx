import { PageHeader } from '@/components/ui/PageHeader';
import { CourseCard } from '@/components/ui/CourseCard';
import { courses } from '@/services/mockData';

export default function MyCourses() {
  const enrolled = courses.filter((c) => c.progress !== undefined);
  return (
    <>
      <PageHeader title="My Courses" subtitle={`${enrolled.length} courses in progress.`} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {enrolled.map((c) => (
          <CourseCard key={c.id} course={c} href={`/student/courses/${c.id}`} showProgress />
        ))}
      </div>
    </>
  );
}
