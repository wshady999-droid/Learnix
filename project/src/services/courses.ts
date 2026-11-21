import { supabase } from '@/services/supabase';
import type { Course } from '@/types';

const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E50914"/><stop offset="1" stop-color="#7a0510"/></linearGradient></defs><rect width="400" height="225" fill="url(#g)"/></svg>'
  );

export type StudentOverview = {
  courses: Course[];
  completedLessons: number;
  minutesSpent: number;
};

export async function fetchStudentOverview(userId: string): Promise<StudentOverview> {
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(
      `course_id,
       courses (
         id, title, description, level, rating, status, created_at, thumbnail_url, teacher_id,
         category:categories ( name ),
         teacher:profiles!courses_teacher_id_fkey ( full_name ),
         lessons ( id, duration_minutes )
       )`
    )
    .eq('student_id', userId);

  if (error) throw error;

  const { data: progressRows, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed, minutes_spent')
    .eq('student_id', userId);

  if (progressError) throw progressError;

  const completedSet = new Set(
    (progressRows ?? []).filter((p) => p.completed).map((p) => p.lesson_id as string)
  );
  const minutesSpent = (progressRows ?? []).reduce(
    (sum, p) => sum + (p.minutes_spent ?? 0),
    0
  );

  const courses: Course[] = (enrollments ?? [])
    .map((row: any) => row.courses)
    .filter(Boolean)
    .map((c: any) => {
      const lessons: { id: string; duration_minutes: number }[] = c.lessons ?? [];
      const done = lessons.filter((l) => completedSet.has(l.id)).length;
      const progress = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
      const totalMinutes = lessons.reduce((s, l) => s + (l.duration_minutes ?? 0), 0);

      return {
        id: c.id,
        title: c.title,
        description: c.description ?? '',
        category: c.category?.name ?? 'General',
        instructor: c.teacher?.full_name || 'Instructor',
        instructorId: c.teacher_id ?? '',
        students: 0,
        lessons: lessons.length,
        duration: totalMinutes >= 60 ? `${Math.round(totalMinutes / 60)}h` : `${totalMinutes}m`,
        level: c.level,
        status: c.status,
        rating: Number(c.rating ?? 0),
        progress,
        createdAt: c.created_at,
        thumbnail: c.thumbnail_url || FALLBACK_THUMB,
      } as Course;
    });

  return { courses, completedLessons: completedSet.size, minutesSpent };
}

export type DueAssignment = {
  id: string;
  title: string;
  course: string;
  due: string;
};

export async function fetchDueAssignments(
  userId: string,
  courseIds: string[]
): Promise<DueAssignment[]> {
  if (courseIds.length === 0) return [];

  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('id, title, due_date, course_id, courses ( title )')
    .in('course_id', courseIds)
    .order('due_date', { ascending: true });

  if (error) throw error;

  const { data: submitted, error: subError } = await supabase
    .from('assignment_submissions')
    .select('assignment_id')
    .eq('student_id', userId);

  if (subError) throw subError;

  const submittedIds = new Set((submitted ?? []).map((s) => s.assignment_id as string));

  return (assignments ?? [])
    .filter((a: any) => !submittedIds.has(a.id))
    .map((a: any) => ({
      id: a.id,
      title: a.title,
      course: a.courses?.title ?? '',
      due: a.due_date
        ? new Date(a.due_date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'No due date',
    }));
}

export async function fetchLatestAttempt(
  userId: string
): Promise<{ quizTitle: string; percentage: number } | null> {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('score, total, quizzes ( title )')
    .eq('student_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  if (!data || data.length === 0) return null;

  const row: any = data[0];
  const percentage = row.total > 0 ? Math.round((row.score / row.total) * 100) : 0;
  return { quizTitle: row.quizzes?.title ?? 'Quiz', percentage };
}
