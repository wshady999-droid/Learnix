import { supabase } from '@/services/supabase';

export interface LessonItem {
  id: string;
  course_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  type: 'video' | 'reading' | 'interactive';
  duration_minutes: number;
  position: number;
  file_path: string | null;
  file_type: string | null;
  file_name: string | null;
  completed: boolean;
}

export interface CourseBasic {
  id: string;
  title: string;
}

const LESSON_COLS =
  'id, course_id, title, content, video_url, type, duration_minutes, position, file_path, file_type, file_name';

export async function getCourseBasic(courseId: string): Promise<CourseBasic | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', courseId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCourseLessons(courseId: string): Promise<LessonItem[]> {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(LESSON_COLS)
    .eq('course_id', courseId)
    .order('position', { ascending: true });
  if (error) throw error;

  const ids = (lessons ?? []).map((l) => l.id);
  let doneSet = new Set<string>();
  if (ids.length > 0) {
    const { data: progress, error: pErr } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .in('lesson_id', ids);
    if (pErr) throw pErr;
    doneSet = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));
  }

  return (lessons ?? []).map((l) => ({ ...(l as Omit<LessonItem, 'completed'>), completed: doneSet.has(l.id) }));
}

export async function getLesson(lessonId: string): Promise<LessonItem | null> {
  const { data: l, error } = await supabase
    .from('lessons')
    .select(LESSON_COLS)
    .eq('id', lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!l) return null;

  const { data: p } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('lesson_id', lessonId)
    .maybeSingle();

  return { ...(l as Omit<LessonItem, 'completed'>), completed: !!p?.completed };
}

export async function getLessonFileUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('lesson-files')
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function setLessonCompleted(lessonId: string, completed: boolean): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase.from('lesson_progress').upsert(
    {
      student_id: userId,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: 'student_id,lesson_id' }
  );
  if (error) throw error;
}