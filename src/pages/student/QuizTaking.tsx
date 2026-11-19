import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Timer } from 'lucide-react';

const questionBank: Record<string, { q: string; options: string[]; answer: number }[]> = {
  default: [
    { q: 'Which tool keeps values between renders?', options: ['useState', 'localStorage', 'CSS variables', 'Props'], answer: 0 },
    { q: 'Where should hooks be called?', options: ['Inside loops', 'Top level of the component', 'Inside conditions', 'Anywhere'], answer: 1 },
    { q: 'What updates the screen after state changes?', options: ['A page reload', 'A re-render', 'A timeout', 'Nothing'], answer: 1 },
    { q: 'Which hook runs side effects?', options: ['useMemo', 'useRef', 'useEffect', 'useId'], answer: 2 },
  ],
};

export default function QuizTaking() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const questions = questionBank.default;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => answers.reduce((s, a, i) => (a === questions[i].answer ? s + 1 : s), 0),
    [answers, questions]
  );
  const pct = Math.round((score / questions.length) * 100);
  const q = questions[current];

  if (!quizId) {
    return <EmptyState icon={<Timer size={26} />} title="Quiz not found" message="Start a quiz from the quizzes page." />;
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center animate-fade-in">
          <p className="font-display text-5xl font-bold text-primary">{pct}%</p>
          <p className="mt-2 text-sm text-muted">You got {score} of {questions.length} right.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button className="btn-primary" onClick={() => navigate('/student/results')}>View results</button>
            <Link to="/student/quizzes" className="btn-secondary">More quizzes</Link>
          </div>
        </div>
      </div>
    );
  }

  const pick = (i: number) => {
    setAnswers(answers.map((a, idx) => (idx === current ? i : a)));
  };

  return (
    <>
      <PageHeader
        title={`Question ${current + 1} of ${questions.length}`}
        subtitle="Pick one answer."
        actions={<span className="btn-secondary"><Timer size={15} /> 20 min</span>}
      />

      <div className="card p-6 sm:p-8">
        <div className="h-2 overflow-hidden rounded-full bg-soft">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <h2 className="mt-6 font-display text-lg font-semibold text-ink">{q.q}</h2>

        <ul className="mt-5 space-y-3">
          {q.options.map((opt, i) => (
            <li key={opt}>
              <button
                onClick={() => pick(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  answers[current] === i ? 'border-primary bg-primary-soft text-primary' : 'text-ink hover:border-primary'
                }`}
                style={answers[current] === i ? undefined : { borderColor: 'var(--border)' }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <button
            className="btn-secondary"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
          >
            <ArrowLeft size={15} /> Back
          </button>
          {current < questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setCurrent(current + 1)}>Next</button>
          ) : (
            <button className="btn-primary" onClick={() => setSubmitted(true)} disabled={answers.includes(-1)}>
              Submit quiz
            </button>
          )}
        </div>
        {current === questions.length - 1 && answers.includes(-1) && (
          <p className="mt-3 text-right text-xs text-muted">Answer all questions to submit.</p>
        )}
      </div>
    </>
  );
}
