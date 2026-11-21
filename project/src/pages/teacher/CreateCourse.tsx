import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Save, Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createCourse, fetchCategories, type CategoryOption } from '@/services/teacher';

const steps = ['Basics', 'Lessons', 'Publish'];

export default function CreateCourse() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [lessons, setLessons] = useState<string[]>(['']);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [publish, setPublish] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCategories();
        if (cancelled) return;
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load categories.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePublish() {
    if (!profile?.id) return;
    if (!title.trim()) {
      setError('Please enter a course title.');
      setStep(0);
      return;
    }
    try {
      setSaving(true);
      setError('');
      await createCourse({
        teacherId: profile.id,
        title: title.trim(),
        description: description.trim(),
        categoryId: categoryId || null,
        level,
        publish,
        lessonTitles: lessons,
      });
      navigate('/teacher/courses');
    } catch (e: any) {
      setError(e?.message ?? 'Could not create the course.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="New Course"
        subtitle="Three quick steps."
        actions={
          <button className="btn-secondary" onClick={() => navigate('/teacher/courses')}>
            <X size={16} /> Cancel
          </button>
        }
      />

      <div className="mx-auto max-w-2xl">
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <button
                onClick={() => setStep(i)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i <= step ? 'bg-primary text-white' : 'bg-soft text-muted'
                }`}
              >
                {i + 1}
              </button>
              <span className={`hidden text-sm font-medium sm:block ${i === step ? 'text-ink' : 'text-muted'}`}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <span className={`h-0.5 flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-line'}`} />
              )}
            </li>
          ))}
        </ol>

        {error && (
          <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="card p-6 sm:p-8">
          {step === 0 && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label htmlFor="title" className="label">Course title</label>
                <input
                  id="title"
                  className="input"
                  placeholder="e.g. React Basics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="desc" className="label">Description</label>
                <textarea
                  id="desc"
                  rows={3}
                  className="input resize-none"
                  placeholder="What will students learn?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cat" className="label">Category</label>
                  <select
                    id="cat"
                    className="input"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.length === 0 && <option value="">No categories yet</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="label">Level</label>
                  <select
                    id="level"
                    className="input"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink">Lessons</h3>
                <button onClick={() => setLessons([...lessons, ''])} className="btn-secondary text-xs">
                  <Plus size={14} /> Add
                </button>
              </div>
              <ul className="mt-5 space-y-3">
                {lessons.map((l, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <input
                      value={l}
                      onChange={(e) => setLessons(lessons.map((v, j) => (j === i ? e.target.value : v)))}
                      className="input"
                      placeholder={`Lesson ${i + 1} title`}
                    />
                    <button
                      onClick={() => setLessons(lessons.filter((_, j) => j !== i))}
                      className="btn-ghost p-2.5 text-danger"
                      aria-label={`Remove lesson ${i + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="font-display text-base font-semibold text-ink">Ready to publish?</h3>
              <p className="mt-1 text-sm text-muted">Students will see the course right away.</p>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-soft p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Publish now</p>
                  <p className="mt-0.5 text-xs text-muted">Otherwise saved as a draft.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={publish}
                    onChange={(e) => setPublish(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-primary after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          )}

          <div
            className="mt-8 flex items-center justify-between border-t pt-6"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-40"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary">
                Continue
              </button>
            ) : (
              <button onClick={handlePublish} disabled={saving} className="btn-primary">
                <Save size={16} /> {saving ? 'Saving...' : publish ? 'Publish' : 'Save draft'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}