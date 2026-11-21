import { supabase } from '@/services/supabase';
import type { Course } from '@/types';

const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E50914"/><stop offset="1" stop-color="#7a0510"/></linearGradient></defs><rect width="400" height="225" fill="url(#g)"/></svg>'
  );

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export async function fetchTeacherCourses(
  teacherId: string,
  instructorName: string
): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select(
      `id, title, description, level, rating, status, created_at, thumbnail_url, teacher_id,
       category:categories ( name ),
       lessons ( id, duration_minutes ),
       enrollments ( id )`
    )
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ((data as any[]) ?? []).map((c) => {
    const lessons: { id: string; duration_minutes: number }[] = c.lessons ?? [];
    const totalMinutes = lessons.reduce((s, l) => s + (l.duration_minutes ?? 0), 0);
    return {
      id: c.id,
      title: c.title,
      description: c.description ?? '',
      category: c.category?.name ?? 'General',
      instructor: instructorName,
      instructorId: c.teacher_id ?? teacherId,
      students: (c.enrollments ?? []).length,
      lessons: lessons.length,
      duration: totalMinutes >= 60 ? `${Math.round(totalMinutes / 60)}h` : `${totalMinutes}m`,
      level: c.level,
      status: c.status,
      rating: Number(c.rating ?? 0),
      createdAt: c.created_at,
      thumbnail: c.thumbnail_url || FALLBACK_THUMB,
    } as Course;
  });
}

export type UpcomingAssignment = {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
};

export type TeacherStats = {
  courses: number;
  students: number;
  quizzes: number;
  toGrade: number;
  upcoming: UpcomingAssignment[];
};

export async function fetchTeacherStats(teacherId: string): Promise<TeacherStats> {
  const { data: courseRows, error } = await supabase
    .from('courses')
    .select('id')
    .eq('teacher_id', teacherId);

  if (error) throw error;

  const courseIds = ((courseRows as any[]) ?? []).map((c) => c.id as string);

  if (courseIds.length === 0) {
    return { courses: 0, students: 0, quizzes: 0, toGrade: 0, upcoming: [] };
  }

  const { data: enrollRows, error: enrollError } = await supabase
    .from('enrollments')
    .select('student_id')
    .in('course_id', courseIds);

  if (enrollError) throw enrollError;

  const students = new Set(((enrollRows as any[]) ?? []).map((e) => e.student_id as string)).size;

  const { count: quizCount, error: quizError } = await supabase
    .from('quizzes')
    .select('id', { count: 'exact', head: true })
    .in('course_id', courseIds);

  if (quizError) throw quizError;

  const { data: assignmentRows, error: assignError } = await supabase
    .from('assignments')
    .select('id, title, due_date, courses ( title )')
    .in('course_id', courseIds)
    .order('due_date', { ascending: true });

  if (assignError) throw assignError;

  const assignments: any[] = assignmentRows ?? [];
  const assignmentIds = assignments.map((a) => a.id as string);

  let toGrade = 0;
  if (assignmentIds.length > 0) {
    const { count, error: subError } = await supabase
      .from('assignment_submissions')
      .select('id', { count: 'exact', head: true })
      .in('assignment_id', assignmentIds)
      .is('grade', null);

    if (subError) throw subError;
    toGrade = count ?? 0;
  }

  const now = Date.now();
  const upcoming: UpcomingAssignment[] = assignments
    .filter((a) => a.due_date && new Date(a.due_date).getTime() >= now)
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      title: a.title,
      courseName: a.courses?.title ?? '',
      dueDate: formatDate(a.due_date),
    }));

  return {
    courses: courseIds.length,
    students,
    quizzes: quizCount ?? 0,
    toGrade,
    upcoming,
  };
}

export type CategoryOption = { id: string; name: string };

export async function fetchCategories(): Promise<CategoryOption[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) throw error;
  return ((data as any[]) ?? []).map((c) => ({ id: c.id, name: c.name }));
}

export type NewCourseInput = {
  teacherId: string;
  title: string;
  description: string;
  categoryId: string | null;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  publish: boolean;
  lessonTitles: string[];
};

export async function createCourse(input: NewCourseInput): Promise<string> {
  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      title: input.title,
      description: input.description || null,
      category_id: input.categoryId,
      teacher_id: input.teacherId,
      level: input.level,
      status: input.publish ? 'published' : 'draft',
    })
    .select('id')
    .single();

  if (error) throw error;

  const courseId = (course as any).id as string;

  const titles = input.lessonTitles.map((t) => t.trim()).filter((t) => t.length > 0);

  if (titles.length > 0) {
    const { error: lessonsError } = await supabase.from('lessons').insert(
      titles.map((title, index) => ({
        course_id: courseId,
        title,
        position: index,
      }))
    );

    if (lessonsError) throw lessonsError;
  }

  return courseId;
}