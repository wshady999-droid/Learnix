import { supabase } from '@/services/supabase';

export async function deleteCourse(courseId: string): Promise<void> {
  const { count: studentCount, error: enrollError } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId);
  if (enrollError) throw enrollError;
  if ((studentCount ?? 0) > 0) {
    throw new Error(
      `Cannot delete this course: ${studentCount} student(s) are enrolled in it.`
    );
  }

  const { count: lessonCount, error: lessonError } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId);
  if (lessonError) throw lessonError;
  if ((lessonCount ?? 0) > 0) {
    throw new Error(
      `Cannot delete this course: it still has ${lessonCount} lesson(s). Delete the lessons first.`
    );
  }

  const { error } = await supabase.from('courses').delete().eq('id', courseId);
  if (error) throw error;
}