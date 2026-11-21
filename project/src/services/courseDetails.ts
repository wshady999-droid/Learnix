import { supabase } from '@/services/supabase';

const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E50914"/><stop offset="1" stop-color="#7a0510"/></linearGradient></defs><rect width="400" height="225" fill="url(#g)"/></svg>'
  );

export type LessonItem = {
  id: string;
  title: string;
  type: string;
  durationMinutes: number;
  completed: boolean;
};

export type CourseDetails = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  rating: number;
  thumbnail: string;
  instructor: string;
  totalMinutes: number;
  enrolled: boolean;
  lessons: LessonItem[];
};

export async function fetchCourseDetails(
  courseId: string,
  userId: string
): Promise<CourseDetails | null> {
  const { data: c, error } = await supabase
    .from('courses')
    .select(
      `id, title, description, level, rating, thumbnail_url,
       category:categories ( name ),
       teacher:profiles!courses_teacher_id_fkey ( full_name )`
    )
    .eq('id', courseId)
    .maybeSingle();

  if (error) throw error;
  if (!c) return null;

  const course: any = c;

  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', userId)
    .maybeSingle();

  if (enrollError) throw enrollError;

  const { data: lessonRows, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, type, duration_minutes, position')
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  if (lessonsError) throw lessonsError;

  const lessonIds = (lessonRows ?? []).map((l: any) => l.id as string);
  let completedSet = new Set<string>();

  if (lessonIds.length > 0) {
    const { data: progressRows, error: progressError } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('student_id', userId)
      .in('lesson_id', lessonIds);

    if (progressError) throw progressError;

    completedSet = new Set(
      (progressRows ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id as string)
    );
  }

  const lessons: LessonItem[] = (lessonRows ?? []).map((l: any) => ({
    id: l.id,
    title: l.title,
    type: l.type ?? 'video',
    durationMinutes: l.duration_minutes ?? 0,
    completed: completedSet.has(l.id),
  }));

  const totalMinutes = lessons.reduce((sum, l) => sum + l.durationMinutes, 0);

  return {
    id: course.id,
    title: course.title,
    description: course.description ?? '',
    category: course.category?.name ?? 'General',
    level: course.level ?? 'Beginner',
    rating: Number(course.rating ?? 0),
    thumbnail: course.thumbnail_url || FALLBACK_THUMB,
    instructor: course.teacher?.full_name || 'Instructor',
    totalMinutes,
    enrolled: !!enrollment,
    lessons,
  };
}

export async function setLessonCompleted(
  userId: string,
  lessonId: string,
  completed: boolean,
  minutes: number
): Promise<void> {
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      student_id: userId,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      minutes_spent: completed ? minutes : 0,
    },
    { onConflict: 'student_id,lesson_id' }
  );

  if (error) throw error;
}