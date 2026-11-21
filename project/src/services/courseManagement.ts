import { supabase } from '@/services/supabase';

const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E50914"/><stop offset="1" stop-color="#7a0510"/></linearGradient></defs><rect width="400" height="225" fill="url(#g)"/></svg>'
  );

export type LessonType = 'video' | 'reading' | 'interactive';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export type ManagedLesson = {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  videoUrl: string;
  position: number;
};

export type ManagedCourse = {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  level: CourseLevel;
  status: CourseStatus;
  rating: number;
  thumbnail: string;
  students: number;
  totalMinutes: number;
  lessons: ManagedLesson[];
};

function mapLesson(l: any): ManagedLesson {
  return {
    id: l.id,
    title: l.title,
    type: (l.type ?? 'video') as LessonType,
    durationMinutes: l.duration_minutes ?? 0,
    videoUrl: l.video_url ?? '',
    position: l.position ?? 0,
  };
}

export async function fetchLessons(courseId: string): Promise<ManagedLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, type, duration_minutes, video_url, position')
    .eq('course_id', courseId)
    .order('position', { ascending: true });

  if (error) throw error;
  return ((data as any[]) ?? []).map(mapLesson);
}

export async function fetchManagedCourse(courseId: string): Promise<ManagedCourse | null> {
  const { data, error } = await supabase
    .from('courses')
    .select(
      `id, title, description, level, rating, status, thumbnail_url, category_id,
       category:categories ( name ),
       enrollments ( id )`
    )
    .eq('id', courseId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const c: any = data;
  const lessons = await fetchLessons(courseId);

  return {
    id: c.id,
    title: c.title,
    description: c.description ?? '',
    categoryId: c.category_id ?? '',
    categoryName: c.category?.name ?? 'General',
    level: c.level as CourseLevel,
    status: c.status as CourseStatus,
    rating: Number(c.rating ?? 0),
    thumbnail: c.thumbnail_url || FALLBACK_THUMB,
    students: (c.enrollments ?? []).length,
    totalMinutes: lessons.reduce((s, l) => s + l.durationMinutes, 0),
    lessons,
  };
}

export type UpdateCourseInput = {
  title: string;
  description: string;
  categoryId: string | null;
  level: CourseLevel;
  status: CourseStatus;
};

export async function updateCourse(courseId: string, input: UpdateCourseInput): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .update({
      title: input.title,
      description: input.description || null,
      category_id: input.categoryId,
      level: input.level,
      status: input.status,
    })
    .eq('id', courseId);

  if (error) throw error;
}

export type CourseOption = { id: string; title: string };

export async function fetchTeacherCourseOptions(teacherId: string): Promise<CourseOption[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data as any[]) ?? []).map((c) => ({ id: c.id, title: c.title }));
}

export type LessonInput = {
  title: string;
  type: LessonType;
  durationMinutes: number;
  videoUrl: string;
};

export async function addLesson(
  courseId: string,
  input: LessonInput,
  position: number
): Promise<void> {
  const { error } = await supabase.from('lessons').insert({
    course_id: courseId,
    title: input.title,
    type: input.type,
    duration_minutes: input.durationMinutes,
    video_url: input.videoUrl || null,
    position,
  });

  if (error) throw error;
}

export async function updateLesson(lessonId: string, input: LessonInput): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .update({
      title: input.title,
      type: input.type,
      duration_minutes: input.durationMinutes,
      video_url: input.videoUrl || null,
    })
    .eq('id', lessonId);

  if (error) throw error;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;
}