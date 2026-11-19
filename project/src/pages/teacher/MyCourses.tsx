import { PageHeader } from '@/components/ui/PageHeader';
import { CourseCard } from '@/components/ui/CourseCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { courses } from '@/services/mockData';

export default function MyCourses() {
  const myCourses = courses.filter((c) => c.instructorId === 'u2');
  return (
    <>
      <PageHeader
        title="My Courses"
        subtitle={`${myCourses.length} courses you teach.`}
        actions={<Link to="/teacher/courses/new" className="btn-primary"><Plus size={16} /> Create course</Link>}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {myCourses.map((c) => (
          <CourseCard key={c.id} course={c} href={`/teacher/courses/${c.id}`} />
        ))}
      </div>
    </>
  );
}
