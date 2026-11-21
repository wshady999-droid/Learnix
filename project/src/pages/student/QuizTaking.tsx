import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import {
  fetchQuizForTaking,
  submitQuiz,
  type QuizForTaking,
  type SubmitResult,
} from '@/services/quizzes';

export default function QuizTaking() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizForTaking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    if (!quizId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchQuizForTaking(quizId);
        if (!cancelled) setQuiz(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load this quiz.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  if (!quizId || !quiz) {
    return (
      <EmptyState
        icon={<Timer size={26} />}
        title="Quiz not found"
        message={error || 'Start a quiz from the quizzes page.'}
      />
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <EmptyState
        icon={<Timer size={26} />}
        title="No questions yet"
        message={error || 'This quiz does not have any questions available.'}
      />
    );
  }

  const questions = quiz.questions;

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card animate-fade-in p-8 text-center">
          <p className="font-display text-5xl font-bold text-primary">{result.percentage}%</p>
          <div className="mt-3">
            <Badge variant={result.passed ? 'success' : 'danger'}>
              {result.passed ? 'Passed' : 'Not passed'}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-muted">
            You scored {result.score} of {result.total}.
          </p>

          <ul className="mt-6 space-y-3 text-left">
            {questions.map((q, idx) => {
              const r = result.review.find((x) => x.question_id === q.id);
              if (!r) return null;
              const yours =
                r.your_answer !== null && r.your_answer !== undefined
                  ? q.options[r.your_answer]
                  : 'No answer';
              return (
                <li
                  key={q.id}
                  className="rounded-xl border p-4"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <p className="text-sm font-semibold text-ink">
                    {idx + 1}. {q.question}
                  </p>
                  <p className={`mt-1 text-xs ${r.is_correct ? 'text-success' : 'text-danger'}`}>
                    Your answer: {yours}
                  </p>
                  {!r.is_correct && (
                    <p className="text-xs text-muted">
                      Correct answer: {q.options[r.correct_index]}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button className="btn-primary" onClick={() => navigate('/student/results')}>
              View results
            </button>
            <Link to="/student/quizzes" className="btn-secondary">
              More quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const allAnswered = questions.every((x) => answers[x.id] !== undefined);

  const pick = (i: number) => {
    setAnswers({ ...answers, [q.id]: i });
  };

  async function handleSubmit() {
    if (!quizId) return;
    try {
      setSubmitting(true);
      setError('');
      const res = await submitQuiz(quizId, answers);
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? 'Could not submit the quiz.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title={`Question ${current + 1} of ${questions.length}`}
        subtitle={quiz.title}
        actions={
          <span className="btn-secondary">
            <Timer size={15} /> {quiz.durationMinutes} min
          </span>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="card p-6 sm:p-8">
        <div className="h-2 overflow-hidden rounded-full bg-soft">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h2 className="mt-6 font-display text-lg font-semibold text-ink">{q.question}</h2>

        <ul className="mt-5 space-y-3">
          {q.options.map((opt, i) => (
            <li key={`${q.id}-${i}`}>
              <button
                onClick={() => pick(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  answers[q.id] === i
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'text-ink hover:border-primary'
                }`}
                style={answers[q.id] === i ? undefined : { borderColor: 'var(--border)' }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>

        <div
          className="mt-8 flex items-center justify-between border-t pt-6"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            className="btn-secondary"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
          >
            <ArrowLeft size={15} /> Back
          </button>
          {current < questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setCurrent(current + 1)}>
              Next
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit quiz'}
            </button>
          )}
        </div>
        {current === questions.length - 1 && !allAnswered && (
          <p className="mt-3 text-right text-xs text-muted">Answer all questions to submit.</p>
        )}
      </div>
    </>
  );
}