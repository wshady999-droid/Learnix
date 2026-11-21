import { supabase } from '@/services/supabase';

export type QuizStatus = 'draft' | 'published';

export type TeacherQuiz = {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  durationMinutes: number;
  passingScore: number;
  dueDate: string;
  status: QuizStatus;
  questionCount: number;
  attempts: number;
  avgScore: number;
};

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

export async function fetchTeacherQuizzes(teacherId: string): Promise<TeacherQuiz[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `id, title, course_id, duration_minutes, passing_score, due_date, status, created_at,
       courses!inner ( title, teacher_id ),
       quiz_questions ( id ),
       quiz_attempts ( score, total )`
    )
    .eq('courses.teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ((data as any[]) ?? []).map((q) => {
    const attempts: { score: number; total: number }[] = q.quiz_attempts ?? [];
    const valid = attempts.filter((a) => a.total > 0);
    const avg = valid.length
      ? Math.round(valid.reduce((s, a) => s + (a.score / a.total) * 100, 0) / valid.length)
      : 0;
    return {
      id: q.id,
      title: q.title,
      courseId: q.course_id,
      courseName: q.courses?.title ?? '',
      durationMinutes: q.duration_minutes ?? 30,
      passingScore: q.passing_score ?? 50,
      dueDate: q.due_date ?? '',
      status: q.status as QuizStatus,
      questionCount: (q.quiz_questions ?? []).length,
      attempts: attempts.length,
      avgScore: avg,
    } as TeacherQuiz;
  });
}

export type QuizInput = {
  courseId: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
  dueDate: string;
};

export async function createQuiz(input: QuizInput): Promise<void> {
  const { error } = await supabase.from('quizzes').insert({
    course_id: input.courseId,
    title: input.title,
    duration_minutes: input.durationMinutes,
    passing_score: input.passingScore,
    due_date: input.dueDate || null,
    status: 'draft',
  });

  if (error) throw error;
}

export async function updateQuiz(
  quizId: string,
  input: Omit<QuizInput, 'courseId'>
): Promise<void> {
  const { error } = await supabase
    .from('quizzes')
    .update({
      title: input.title,
      duration_minutes: input.durationMinutes,
      passing_score: input.passingScore,
      due_date: input.dueDate || null,
    })
    .eq('id', quizId);

  if (error) throw error;
}

export async function setQuizStatus(quizId: string, status: QuizStatus): Promise<void> {
  const { error } = await supabase.from('quizzes').update({ status }).eq('id', quizId);
  if (error) throw error;
}

export type QuestionRow = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
};

export async function fetchQuestions(quizId: string): Promise<QuestionRow[]> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, question, options, correct_index, points')
    .eq('quiz_id', quizId)
    .order('id', { ascending: true });

  if (error) throw error;

  return ((data as any[]) ?? []).map((q) => ({
    id: q.id,
    question: q.question,
    options: parseOptions(q.options),
    correctIndex: q.correct_index ?? 0,
    points: q.points ?? 1,
  }));
}

export type QuestionInput = {
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
};

export async function addQuestion(quizId: string, input: QuestionInput): Promise<void> {
  const { error } = await supabase.from('quiz_questions').insert({
    quiz_id: quizId,
    question: input.question,
    options: input.options,
    correct_index: input.correctIndex,
    points: input.points,
  });

  if (error) throw error;
}

export async function updateQuestion(questionId: string, input: QuestionInput): Promise<void> {
  const { error } = await supabase
    .from('quiz_questions')
    .update({
      question: input.question,
      options: input.options,
      correct_index: input.correctIndex,
      points: input.points,
    })
    .eq('id', questionId);

  if (error) throw error;
}

export async function deleteQuestion(questionId: string): Promise<void> {
  const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId);
  if (error) throw error;
}