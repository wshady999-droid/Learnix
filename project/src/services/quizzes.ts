import { supabase } from '@/services/supabase';

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((o) => String(o));
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((o) => String(o));
    } catch {
      return [];
    }
  }
  return [];
}

export type QuizSummary = {
  id: string;
  title: string;
  courseName: string;
  durationMinutes: number;
  passingScore: number;
  dueDate: string;
  questionCount: number | null;
};

export async function fetchAvailableQuizzes(): Promise<QuizSummary[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, duration_minutes, passing_score, due_date, courses ( title )')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows: any[] = data ?? [];

  const counts = await Promise.all(
    rows.map(async (q) => {
      const { data: qs, error: qErr } = await supabase.rpc('get_quiz_questions', {
        p_quiz_id: q.id,
      });
      if (qErr || !Array.isArray(qs)) return null;
      return qs.length as number;
    })
  );

  return rows.map((q, i) => ({
    id: q.id,
    title: q.title,
    courseName: q.courses?.title ?? '',
    durationMinutes: q.duration_minutes ?? 30,
    passingScore: q.passing_score ?? 50,
    dueDate: formatDate(q.due_date),
    questionCount: counts[i],
  }));
}

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  points: number;
};

export type QuizForTaking = {
  id: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
};

export async function fetchQuizForTaking(quizId: string): Promise<QuizForTaking | null> {
  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select('id, title, duration_minutes, passing_score')
    .eq('id', quizId)
    .maybeSingle();

  if (error) throw error;
  if (!quiz) return null;

  const { data: qs, error: qErr } = await supabase.rpc('get_quiz_questions', {
    p_quiz_id: quizId,
  });

  if (qErr) throw qErr;

  const questions: QuizQuestion[] = ((qs as any[]) ?? []).map((q) => ({
    id: q.id,
    question: q.question,
    options: parseOptions(q.options),
    points: q.points ?? 1,
  }));

  return {
    id: quiz.id,
    title: quiz.title,
    durationMinutes: quiz.duration_minutes ?? 30,
    passingScore: quiz.passing_score ?? 50,
    questions,
  };
}

export type ReviewItem = {
  question_id: string;
  your_answer: number | null;
  correct_index: number;
  is_correct: boolean;
};

export type SubmitResult = {
  attempt_id: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  review: ReviewItem[];
};

export async function submitQuiz(
  quizId: string,
  answers: Record<string, number>
): Promise<SubmitResult> {
  const { data, error } = await supabase.rpc('submit_quiz', {
    p_quiz_id: quizId,
    p_answers: answers,
  });

  if (error) throw error;
  return data as SubmitResult;
}

export type QuizResultRow = {
  id: string;
  quizTitle: string;
  courseName: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
};

export async function fetchQuizResults(userId: string): Promise<QuizResultRow[]> {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('id, score, total, submitted_at, quizzes ( title, courses ( title ) )')
    .eq('student_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  return ((data as any[]) ?? []).map((a) => ({
    id: a.id,
    quizTitle: a.quizzes?.title ?? 'Quiz',
    courseName: a.quizzes?.courses?.title ?? '',
    score: a.score ?? 0,
    total: a.total ?? 0,
    percentage: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    completedAt: formatDate(a.submitted_at),
  }));
}