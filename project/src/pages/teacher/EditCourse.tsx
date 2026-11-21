import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchCategories, type CategoryOption } from '@/services/teacher';
import {
  fetchManagedCourse,
  updateCourse,
  type CourseLevel,
  type CourseStatus,
} from '@/services/courseManagement';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    level: 'Beginner' as CourseLevel,
    status: 'draft' as CourseStatus,
  });

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [course, cats] = await Promise.all([
          fetchManagedCourse(courseId),
          fetchCategories(),
        ]);
        if (cancelled) return;
        setCategories(cats);
        if (course) {
          setFound(true);
          setCourseTitle(course.title);
          setForm({
            title: course.title,
            description: course.description,
            categoryId: course.categoryId,
            level: course.level,
            status: course.status,
          });
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load this course.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!found || !courseId) {
    return (
      <EmptyState
        icon={<Save size={26} />}
        title="Course not found"
        message={error || 'Go back to your courses.'}
      />
    );
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please enter a course title.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await updateCourse(courseId, {
        title: form.title.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId || null,
        level: form.level,
        status: form.status,
      });
      navigate(`/teacher/courses/${courseId}`);
    } catch (err: any) {
      setError(err?.message ?? 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Edit Course"
        subtitle={courseTitle}
        actions={
          <Link to={`/teacher/courses/${courseId}`} className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />

      <div className="mx-auto max-w-2xl">
        {error && (
          <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={save} className="card space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="e-title" className="label">Title</label>
            <input
              id="e-title"
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="e-desc" className="label">Description</label>
            <textarea
              id="e-desc"
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="e-cat" className="label">Category</label>
              <select
                id="e-cat"
                className="input"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="e-level" className="label">Level</label>
              <select
                id="e-level"
                className="input"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as CourseLevel })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="e-status" className="label">Status</label>
              <select
                id="e-status"
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div
            className="flex justify-end gap-3 border-t pt-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/teacher/courses/${courseId}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}