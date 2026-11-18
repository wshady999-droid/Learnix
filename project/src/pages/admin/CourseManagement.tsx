import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpen, Plus, Star, Users } from 'lucide-react';
import { courses } from '@/services/mockData';

const statusVariant = { published: 'success', draft: 'warning', archived: 'neutral' } as const;

export default function CourseManagement() {
  return (
    <>
      <PageHeader
        title="Course Management"
        subtitle="Oversee the full course catalog across all instructors."
        actions={<button className="btn-primary"><Plus size={16} /> New course</button>}
      />
      <div className="mb-5">
        <SearchInput placeholder="Search courses or instructors..." />
      </div>
      {courses.length === 0 ? (
        <EmptyState icon={<BookOpen size={26} />} title="No courses yet" message="Courses created by teachers will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <div key={c.id} className="card group overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
              <div className="relative h-36">
                <img src={c.thumbnail} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute right-3 top-3"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-base font-semibold text-ink">{c.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{c.instructor} · {c.category}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users size={13} /> {c.students}</span>
                  <span className="flex items-center gap-1 font-medium text-amber-500"><Star size={13} fill="currentColor" /> {c.rating}</span>
                  <span>{c.lessons} lessons</span>
                </div>
                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                  <button className="btn-secondary flex-1 py-2 text-xs">View</button>
                  <button className="btn-ghost py-2 text-xs text-red-500">Archive</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
