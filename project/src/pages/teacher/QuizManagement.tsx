import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, ClipboardList, Clock, Users, Pencil, ListChecks, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchTeacherCourseOptions, type CourseOption } from '@/services/courseManagement';
import {
  addQuestion,
  createQuiz,
  deleteQuestion,
  fetchQuestions,
  fetchTeacherQuizzes,
  setQuizStatus,
  updateQuestion,
  updateQuiz,
  type QuestionRow,
  type TeacherQuiz,
} from '@/services/teacherQuizzes';

const emptyQuizForm = { title: '', courseId: '', duration: '30', passing: '50', dueDate: '' };
const emptyQuestionForm = {
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  points: '1',
};
const letters = ['A', 'B', 'C', 'D'];

export default function QuizManagement() {
  const { profile } = useAuth();
  const [quizzes, setQuizzes] = useState<TeacherQuiz[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherQuiz | null>(null);
  const [form, setForm] = useState(emptyQuizForm);
  const [saving, setSaving] = useState(false);

  const [qOpen, setQOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<TeacherQuiz | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [qForm, setQForm] = useState(emptyQuestionForm);
  const [editingQ, setEditingQ] = useState<QuestionRow | null>(null);
  const [qSaving, setQSaving] = useState(false);
  const [qError, setQError] = useState('');

  const load = useCallback(async () => {
    if (!profile?.id) return;
    try {
      setError('');
      const [q, c] = await Promise.all([
        fetchTeacherQuizzes(profile.id),
        fetchTeacherCourseOptions(profile.id),
      ]);
      setQuizzes(q);
      setCourses(c);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load your quizzes.');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () =>
      quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(query.toLowerCase()) ||
          q.courseName.toLowerCase().includes(query.toLowerCase())
      ),
    [quizzes, query]
  );

  const openAdd = () => {
    setForm({ ...emptyQuizForm, courseId: courses[0]?.id ?? '' });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (q: TeacherQuiz) => {
    setForm({
      title: q.title,
      courseId: q.courseId,
      duration: String(q.durationMinutes),
      passing: String(q.passingScore),
      dueDate: q.dueDate,
    });
    setEditing(q);
    setOpen(true);
  };

  const saveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!editing && !form.courseId) {
      setError('Create a course first, then add a quiz to it.');
      return;
    }
    const duration = Math.max(1, parseInt(form.duration, 10) || 30);
    const passing = Math.min(100, Math.max(0, parseInt(form.passing, 10) || 50));
    try {
      setSaving(true);
      setError('');
      if (editing) {
        await updateQuiz(editing.id, {
          title: form.title.trim(),
          durationMinutes: duration,
          passingScore: passing,
          dueDate: form.dueDate,
        });
      } else {
        await createQuiz({
          courseId: form.courseId,
          title: form.title.trim(),
          durationMinutes: duration,
          passingScore: passing,
          dueDate: form.dueDate,
        });
      }
      setOpen(false);
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Could not save the quiz.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (q: TeacherQuiz) => {
    if (q.status === 'draft' && q.questionCount === 0) {
      setError('Add at least one question before publishing this quiz.');
      return;
    }
    try {
      setError('');
      await setQuizStatus(q.id, q.status === 'published' ? 'draft' : 'published');
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Could not update the quiz status.');
    }
  };

  const reloadQuestions = async (quizId: string) => {
    setQuestions(await fetchQuestions(quizId));
  };

  const openQuestions = async (q: TeacherQuiz) => {
    setActiveQuiz(q);
    setQuestions([]);
    setQForm(emptyQuestionForm);
    setEditingQ(null);
    setQError('');
    setQOpen(true);
    try {
      await reloadQuestions(q.id);
    } catch (err: any) {
      setQError(err?.message ?? 'Could not load the questions.');
    }
  };

  const startEditQuestion = (q: QuestionRow) => {
    const padded = [...q.options];
    while (padded.length < 4) padded.push('');
    setQForm({
      question: q.question,
      options: padded.slice(0, 4),
      correctIndex: q.correctIndex,
      points: String(q.points),
    });
    setEditingQ(q);
    setQError('');
  };

  const cancelEditQuestion = () => {
    setQForm(emptyQuestionForm);
    setEditingQ(null);
    setQError('');
  };

  const saveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz) return;
    if (!qForm.question.trim()) {
      setQError('Please write the question.');
      return;
    }
    const filled = qForm.options
      .map((text, index) => ({ text: text.trim(), index }))
      .filter((o) => o.text.length > 0);
    if (filled.length < 2) {
      setQError('Add at least two answer options.');
      return;
    }
    const correctPos = filled.findIndex((o) => o.index === qForm.correctIndex);
    if (correctPos < 0) {
      setQError('The correct answer must be one of the filled options.');
      return;
    }
    const input = {
      question: qForm.question.trim(),
      options: filled.map((o) => o.text),
      correctIndex: correctPos,
      points: Math.max(1, parseInt(qForm.points, 10) || 1),
    };
    try {
      setQSaving(true);
      setQError('');
      if (editingQ) {
        await updateQuestion(editingQ.id, input);
      } else {
        await addQuestion(activeQuiz.id, input);
      }
      setQForm(emptyQuestionForm);
      setEditingQ(null);
      await reloadQuestions(activeQuiz.id);
      await load();
    } catch (err: any) {
      setQError(err?.message ?? 'Could not save the question.');
    } finally {
      setQSaving(false);
    }
  };

  const removeQuestion = async (q: QuestionRow) => {
    if (!activeQuiz) return;
    if (!window.confirm('Delete this question?')) return;
    try {
      setQError('');
      await deleteQuestion(q.id);
      await reloadQuestions(activeQuiz.id);
      await load();
    } catch (err: any) {
      setQError(err?.message ?? 'Could not delete the question.');
    }
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <>
      <PageHeader
        title="Quizzes"
        subtitle={`${quizzes.length} quizzes across your courses.`}
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> New quiz
          </button>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mb-5">
        <SearchInput placeholder="Search quizzes..." onChange={setQuery} />
      </div>

      {quizzes.length === 0 && !error ? (
        <EmptyState
          icon={<ClipboardList size={26} />}
          title="No quizzes yet"
          message="Create your first quiz, then add its questions."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((q) => (
            <div key={q.id} className="card p-6 transition-colors hover:border-primary">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <ClipboardList size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">{q.title}</h3>
                    <p className="text-xs text-muted">{q.courseName}</p>
                  </div>
                </div>
                <Badge variant={q.status === 'published' ? 'success' : 'warning'}>{q.status}</Badge>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <ClipboardList size={14} /> {q.questionCount} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {q.durationMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} /> {q.attempts} attempts
                </span>
              </div>
              <div
                className="mt-4 flex items-center justify-between border-t pt-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-sm text-muted">Average score</span>
                <span className="font-display text-base font-bold text-ink">{q.avgScore}%</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-secondary flex-1 py-2 text-xs" onClick={() => openQuestions(q)}>
                  <ListChecks size={12} /> Questions
                </button>
                <button className="btn-secondary flex-1 py-2 text-xs" onClick={() => openEdit(q)}>
                  <Pencil size={12} /> Edit
                </button>
                <button className="btn-ghost py-2 text-xs" onClick={() => togglePublish(q)}>
                  {q.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? 'Edit quiz' : 'New quiz'} onClose={() => setOpen(false)}>
        <form onSubmit={saveQuiz} className="space-y-4">
          <div>
            <label htmlFor="q-title" className="label">Title</label>
            <input
              id="q-title"
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Quiz title"
            />
          </div>
          {!editing && (
            <div>
              <label htmlFor="q-course" className="label">Course</label>
              <select
                id="q-course"
                className="input"
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              >
                {courses.length === 0 && <option value="">No courses yet</option>}
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="q-dur" className="label">Minutes</label>
              <input
                id="q-dur"
                type="number"
                min={1}
                max={240}
                className="input"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="q-pass" className="label">Passing score (%)</label>
              <input
                id="q-pass"
                type="number"
                min={0}
                max={100}
                className="input"
                value={form.passing}
                onChange={(e) => setForm({ ...form, passing: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="q-due" className="label">Due date (optional)</label>
            <input
              id="q-due"
              type="date"
              className="input"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Create quiz'}
          </button>
        </form>
      </Modal>

      <Modal
        open={qOpen}
        title={activeQuiz ? `Questions: ${activeQuiz.title}` : 'Questions'}
        onClose={() => setQOpen(false)}
      >
        <div className="space-y-5">
          {qError && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {qError}
            </div>
          )}

          {questions.length === 0 ? (
            <p className="text-sm text-muted">No questions yet. Add the first one below.</p>
          ) : (
            <ul className="space-y-3">
              {questions.map((q, idx) => (
                <li
                  key={q.id}
                  className="rounded-xl border p-4"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        className="btn-ghost p-2"
                        onClick={() => startEditQuestion(q)}
                        aria-label="Edit question"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-ghost p-2 text-danger"
                        onClick={() => removeQuestion(q)}
                        aria-label="Delete question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((o, i) => (
                      <li
                        key={i}
                        className={`text-xs ${
                          i === q.correctIndex ? 'font-semibold text-success' : 'text-muted'
                        }`}
                      >
                        {letters[i] ?? i + 1}. {o}
                        {i === q.correctIndex ? ' (correct)' : ''}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted">{q.points} point(s)</p>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={saveQuestion}
            className="space-y-3 border-t pt-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <h4 className="font-display text-sm font-semibold text-ink">
              {editingQ ? 'Edit question' : 'Add a question'}
            </h4>
            <div>
              <label htmlFor="qq-text" className="label">Question</label>
              <textarea
                id="qq-text"
                rows={2}
                className="input resize-none"
                value={qForm.question}
                onChange={(e) => setQForm({ ...qForm, question: e.target.value })}
                placeholder="Write the question"
              />
            </div>
            <div className="space-y-2">
              <p className="label">Options (select the correct one)</p>
              {qForm.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correct-option"
                    checked={qForm.correctIndex === i}
                    onChange={() => setQForm({ ...qForm, correctIndex: i })}
                    aria-label={`Option ${letters[i]} is correct`}
                  />
                  <input
                    className="input"
                    value={opt}
                    onChange={(e) =>
                      setQForm({
                        ...qForm,
                        options: qForm.options.map((o, j) => (j === i ? e.target.value : o)),
                      })
                    }
                    placeholder={`Option ${letters[i]}`}
                  />
                </div>
              ))}
            </div>
            <div className="max-w-[140px]">
              <label htmlFor="qq-points" className="label">Points</label>
              <input
                id="qq-points"
                type="number"
                min={1}
                className="input"
                value={qForm.points}
                onChange={(e) => setQForm({ ...qForm, points: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1" disabled={qSaving}>
                {qSaving ? 'Saving...' : editingQ ? 'Save question' : 'Add question'}
              </button>
              {editingQ && (
                <button type="button" className="btn-secondary" onClick={cancelEditQuestion}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}