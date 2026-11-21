import { supabase } from '@/services/supabase';

export type TeacherStudent = {
  id: string;
  name: string;
  email: string;
  attempts: number;
  avgScore: number;
  completedLessons: number;
  timeSpent: string;
};

function formatMinutes(minutes: number): string {
  if (minutes >= 60) return `${(minutes / 60).toFixed(1)}h`;
  return `${minutes}m`;
}

export async function fetchTeacherStudents(teacherId: string): Promise<TeacherStudent[]> {
  const { data: courseRows, error } = await supabase
    .from('courses')
    .select('id')
    .eq('teacher_id', teacherId);

  if (error) throw error;

  const courseIds = ((courseRows as any[]) ?? []).map((c) => c.id as string);
  if (courseIds.length === 0) return [];

  const { data: enrollRows, error: enrollError } = await supabase
    .from('enrollments')
    .select('student_id, student:profiles ( id, full_name, email )')
    .in('course_id', courseIds);

  if (enrollError) throw enrollError;

  const students = new Map<string, { name: string; email: string }>();
  ((enrollRows as any[]) ?? []).forEach((r) => {
    const id = r.student_id as string;
    if (!students.has(id)) {
      students.set(id, {
        name: r.student?.full_name || r.student?.email || 'Student',
        email: r.student?.email ?? '',
      });
    }
  });

  const studentIds = Array.from(students.keys());
  if (studentIds.length === 0) return [];

  const { data: progressRows, error: progressError } = await supabase
    .from('lesson_progress')
    .select('student_id, completed, minutes_spent')
    .in('student_id', studentIds);

  if (progressError) throw progressError;

  const { data: attemptRows, error: attemptError } = await supabase
    .from('quiz_attempts')
    .select('student_id, score, total')
    .in('student_id', studentIds);

  if (attemptError) throw attemptError;

  return studentIds.map((id) => {
    const info = students.get(id)!;
    const progress = ((progressRows as any[]) ?? []).filter((p) => p.student_id === id);
    const attempts = ((attemptRows as any[]) ?? []).filter(
      (a) => a.student_id === id && a.total > 0
    );
    const completed = progress.filter((p) => p.completed).length;
    const minutes = progress.reduce((s, p) => s + (p.minutes_spent ?? 0), 0);
    const avg = attempts.length
      ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length)
      : 0;

    return {
      id,
      name: info.name,
      email: info.email,
      attempts: attempts.length,
      avgScore: avg,
      completedLessons: completed,
      timeSpent: formatMinutes(minutes),
    };
  });
}