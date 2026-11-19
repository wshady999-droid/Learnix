import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Save } from 'lucide-react';
import { courses as seedCourses } from '@/services/mockData';
import type { Course } from '@/types';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = seedCourses.find((c) => c.id === courseId);
  const [form, setForm] = useState({
    title: course?.title ?? '',
    description: course?.description ?? '',
    category: course?.category ?? 'Web Development',
    level: (course?.level ?? 'Beginner') as Course['level'],
  });

  if (!course) {
    return <EmptyState icon={<Save size={26} />} title="Course not found" message="Go back to your courses." />;
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/teacher/courses/${course.id}`);
  };

  return (
    <>
      <PageHeader
        title="Edit Course"
        subtitle={course.title}
        actions={<Link to={`/teacher/courses/${course.id}`} className="btn-secondary"><ArrowLeft size={16} /> Back</Link>}
      />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={save} className="card space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="e-title" className="label">Title</label>
            <input id="e-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label htmlFor="e-desc" className="label">Description</label>
            <textarea id="e-desc" rows={3} className="input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="e-cat" className="label">Category</label>
              <select id="e-cat" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Web Development</option><option>Data Science</option><option>Design</option><option>Business</option><option>Marketing</option>
              </select>
            </div>
            <div>
              <label htmlFor="e-level" className="label">Level</label>
              <select id="e-level" className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Course['level'] })}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate(`/teacher/courses/${course.id}`)}>Cancel</button>
            <button type="submit" className="btn-primary"><Save size={16} /> Save</button>
          </div>
        </form>
      </div>
    </>
  );
}
