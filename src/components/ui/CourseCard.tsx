import { Link } from 'react-router-dom';
import type { Course } from '@/types';
import { BookOpen, Users, Star, Clock } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  course: Course;
  href: string;
  showProgress?: boolean;
}

const levelStyles: Record<Course['level'], string> = {
  Beginner: 'bg-success/10 text-success',
  Intermediate: 'bg-warning/10 text-warning',
  Advanced: 'bg-danger/10 text-danger',
};

export function CourseCard({ course, href, showProgress }: CourseCardProps) {
  return (
    <Link to={href} className="card group block overflow-hidden hover:border-primary">
      <div className="relative h-36 overflow-hidden bg-soft">
        {course.thumbnail && (
          <img src={course.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-card px-2 py-1 text-xs font-medium text-ink">
          {course.category}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className={`rounded-full px-2 py-0.5 font-medium ${levelStyles[course.level]}`}>{course.level}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
        </div>
        <h3 className="mt-2 truncate text-base font-semibold text-ink">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{course.description}</p>
        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted" style={{ borderColor: 'var(--border)' }}>
          <span className="flex items-center gap-1"><BookOpen size={13} /> {course.lessons} lessons</span>
          <span className="flex items-center gap-1"><Users size={13} /> {course.students}</span>
          <span className="flex items-center gap-1"><Star size={13} /> {course.rating || '—'}</span>
        </div>
        {showProgress && course.progress !== undefined && (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
              <span>Progress</span>
              <span className="font-medium text-ink">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        )}
      </div>
    </Link>
  );
}
