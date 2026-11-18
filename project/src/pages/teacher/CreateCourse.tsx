import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Save, Plus, Trash2, X } from 'lucide-react';

const steps = ['Basics', 'Curriculum', 'Publish'];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [lessons, setLessons] = useState<string[]>(['']);

  return (
    <>
      <PageHeader
        title="Create Course"
        subtitle="Set up a new course step by step."
        actions={
          <button className="btn-secondary" onClick={() => navigate('/teacher/courses')}><X size={16} /> Cancel</button>
        }
      />

      <div className="mx-auto max-w-3xl">
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <button
                onClick={() => setStep(i)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i <= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </button>
              <span className={`hidden text-sm font-medium sm:block ${i === step ? 'text-ink' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <span className={`h-0.5 flex-1 rounded-full ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />}
            </li>
          ))}
        </ol>

        <div className="card p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label htmlFor="title" className="label">Course title</label>
                <input id="title" className="input" placeholder="e.g. React Fundamentals" />
              </div>
              <div>
                <label htmlFor="desc" className="label">Description</label>
                <textarea id="desc" rows={4} className="input resize-none" placeholder="What will students learn?" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="cat" className="label">Category</label>
                  <select id="cat" className="input"><option>Web Development</option><option>Data Science</option><option>Design</option><option>Business</option><option>Marketing</option></select>
                </div>
                <div>
                  <label htmlFor="level" className="label">Level</label>
                  <select id="level" className="input"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
                </div>
                <div>
                  <label htmlFor="dur" className="label">Estimated duration</label>
                  <input id="dur" className="input" placeholder="e.g. 12h 30m" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">Curriculum</h3>
                  <p className="text-sm text-gray-500">Add lessons in the order students will complete them.</p>
                </div>
                <button onClick={() => setLessons([...lessons, ''])} className="btn-secondary text-xs"><Plus size={14} /> Add lesson</button>
              </div>
              <ul className="mt-5 space-y-3">
                {lessons.map((l, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600">{i + 1}</span>
                    <input
                      value={l}
                      onChange={(e) => setLessons(lessons.map((v, j) => (j === i ? e.target.value : v)))}
                      className="input"
                      placeholder={`Lesson ${i + 1} title`}
                    />
                    <button
                      onClick={() => setLessons(lessons.filter((_, j) => j !== i))}
                      className="btn-ghost p-2.5 text-red-500 hover:bg-red-50"
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
              <h3 className="font-display text-base font-semibold text-ink">Publishing</h3>
              <p className="text-sm text-gray-500">Review your settings and make the course live.</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="thumb" className="label">Thumbnail URL</label>
                  <input id="thumb" className="input" placeholder="https://..." />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                  <div>
                    <p className="text-sm font-medium text-ink">Publish immediately</p>
                    <p className="mt-0.5 text-xs text-gray-400">Otherwise saved as a draft.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary-600 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="btn-secondary disabled:opacity-40">
              Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary">Continue</button>
            ) : (
              <button onClick={() => navigate('/teacher/courses')} className="btn-primary"><Save size={16} /> Publish course</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
