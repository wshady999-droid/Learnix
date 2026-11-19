import type { Course } from '@/types';
import { BookOpen, Users, Star, Clock } from 'lucide-react';

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
    <a href={href} className="card group block overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-lg bg-card/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
          {course.category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className={`rounded-full px-2 py-0.5 font-medium ${levelStyles[course.level]}`}>
            {course.level}
          </span>
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
        </div>
        <h3 className="mt-2.5 font-display text-base font-semibold text-ink transition-colors group-hover:text-primary line-clamp-1">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-muted line-clamp-2">{course.description}</p>
        <div className="mt-4 flex items-center justify-between border-t pt-3.5 text-xs text-muted" style={{ borderColor: 'var(--border)' }}>
          <span className="flex items-center gap-1.5"><BookOpen size={13} /> {course.lessons} lessons</span>
          <span className="flex items-center gap-1.5"><Users size={13} /> {course.students}</span>
          <span className="flex items-center gap-1 font-medium text-warning"><Star size={13} fill="currentColor" /> {course.rating}</span>
        </div>
        {showProgress && course.progress !== undefined && (
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted">
              <span>Progress</span>
              <span className="text-primary">{course.progress}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#FF3038] transition-all duration-700" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
