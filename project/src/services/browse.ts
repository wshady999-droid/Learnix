import { supabase } from '@/services/supabase';

export interface BrowseCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  level: string;
  rating: number;
  thumbnail: string | null;
  enrolled: boolean;
}

const one = (x: any) => (Array.isArray(x) ? x[0] ?? null : x ?? null);

export async function fetchBrowseCourses(userId: string): Promise<BrowseCourse[]> {
  const { data, error } = await supabase
    .from('courses')
    .select(
      'id, title, description, level, rating, thumbnail_url, category:categories(name), teacher:profiles!courses_teacher_id_fkey(full_name)'
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const { data: enr, error: enrError } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', userId);
  if (enrError) throw enrError;
  const enrolledIds = new Set((enr ?? []).map((e) => e.course_id as string));

  return (data ?? []).map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description ?? '',
    category: one(c.category)?.name ?? 'General',
    instructor: one(c.teacher)?.full_name || 'Instructor',
    level: c.level,
    rating: Number(c.rating ?? 0),
    thumbnail: c.thumbnail_url,
    enrolled: enrolledIds.has(c.id),
  }));
}

export async function enrollInCourse(courseId: string, userId: string) {
  const { error } = await supabase.from('enrollments').insert({ course_id: courseId, student_id: userId });
  if (error) throw error;
}
