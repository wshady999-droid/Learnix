import { supabase } from '@/services/supabase';

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatMinutes(minutes: number): string {
  if (minutes >= 60) return `${(minutes / 60).toFixed(1)}h`;
  return `${minutes}m`;
}

export type StudentCourseProgress = {
  courseId: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
};

export type StudentAttempt = {
  id: string;
  quizTitle: string;
  courseName: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
};

export type StudentDetail = {
  id: string;
  name: string;
  email: string;
  attempts: number;
  avgScore: number;
  completedLessons: number;
  timeSpent: string;
  courses: StudentCourseProgress[];
  results: StudentAttempt[];
};

export async function fetchStudentDetail(
  teacherId: string,
  studentId: string
): Promise<StudentDetail | null> {
  const { data: courseRows, error: courseError } = await supabase
    .from('courses')
    .select('id, title')
    .eq('teacher_id', teacherId);

  if (courseError) throw courseError;

  const teacherCourses = (courseRows as any[]) ?? [];
  if (teacherCourses.length === 0) return null;

  const { data: enrollRows, error: enrollError } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', studentId)
    .in(
      'course_id',
      teacherCourses.map((c) => c.id as string)
    );

  if (enrollError) throw enrollError;

  const enrolledIds = ((enrollRows as any[]) ?? []).map((e) => e.course_id as string);
  if (enrolledIds.length === 0) return null;

  const { data: profileRow, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', studentId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profileRow) return null;

  const { data: lessonRows, error: lessonError } = await supabase
    .from('lessons')
    .select('id, course_id')
    .in('course_id', enrolledIds);

  if (lessonError) throw lessonError;

  const lessons = (lessonRows as any[]) ?? [];
  const lessonIds = new Set(lessons.map((l) => l.id as string));

  const { data: progressRows, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, minutes_spent')
    .eq('student_id', studentId);

  if (progressError) throw progressError;

  const progress = ((progressRows as any[]) ?? []).filter((p) => lessonIds.has(p.lesson_id));
  const completedSet = new Set(
    progress.filter((p) => p.completed).map((p) => p.lesson_id as string)
  );
  const minutes = progress.reduce((sum, p) => sum + (p.minutes_spent ?? 0), 0);

  const { data: attemptRows, error: attemptError } = await supabase
    .from('quiz_attempts')
    .select('id, score, total, submitted_at, quizzes ( title, course_id, courses ( title ) )')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });

  if (attemptError) throw attemptError;

  const results: StudentAttempt[] = ((attemptRows as any[]) ?? [])
    .filter((a) => enrolledIds.includes(a.quizzes?.course_id))
    .map((a) => ({
      id: a.id,
      quizTitle: a.quizzes?.title ?? 'Quiz',
      courseName: a.quizzes?.courses?.title ?? '',
      score: a.score ?? 0,
      total: a.total ?? 0,
      percentage: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
      date: formatDate(a.submitted_at),
    }));

  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  const courses: StudentCourseProgress[] = enrolledIds.map((courseId) => {
    const courseLessons = lessons.filter((l) => l.course_id === courseId);
    const done = courseLessons.filter((l) => completedSet.has(l.id)).length;
    const title = teacherCourses.find((c) => c.id === courseId)?.title ?? '';
    return {
      courseId,
      title,
      totalLessons: courseLessons.length,
      completedLessons: done,
      percent: courseLessons.length ? Math.round((done / courseLessons.length) * 100) : 0,
    };
  });

  const p: any = profileRow;

  return {
    id: p.id,
    name: p.full_name || p.email || 'Student',
    email: p.email ?? '',
    attempts: results.length,
    avgScore,
    completedLessons: completedSet.size,
    timeSpent: formatMinutes(minutes),
    courses,
    results,
  };
}