import { supabase } from '@/services/supabase';

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export type TeacherAssignment = {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  points: number;
  submissions: number;
  graded: number;
  isClosed: boolean;
};

export async function fetchTeacherAssignments(teacherId: string): Promise<TeacherAssignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select(
      `id, title, due_date, points, created_at,
       courses!inner ( title, teacher_id ),
       assignment_submissions ( id, grade )`
    )
    .eq('courses.teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return ((data as any[]) ?? []).map((a) => {
    const subs: { id: string; grade: number | null }[] = a.assignment_submissions ?? [];
    return {
      id: a.id,
      title: a.title,
      courseName: a.courses?.title ?? '',
      dueDate: formatDate(a.due_date),
      points: a.points ?? 100,
      submissions: subs.length,
      graded: subs.filter((s) => s.grade !== null && s.grade !== undefined).length,
      isClosed: a.due_date ? new Date(a.due_date).getTime() < Date.now() : false,
    } as TeacherAssignment;
  });
}

export type NewAssignmentInput = {
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
};

export async function createAssignment(input: NewAssignmentInput): Promise<void> {
  const { error } = await supabase.from('assignments').insert({
    course_id: input.courseId,
    title: input.title,
    description: input.description || null,
    due_date: new Date(`${input.dueDate}T23:59:00`).toISOString(),
    points: input.points,
  });

  if (error) throw error;
}

export type SubmissionRowData = {
  id: string;
  studentName: string;
  studentEmail: string;
  fileUrl: string;
  submittedAt: string;
  grade: number | null;
  feedback: string;
};

export async function fetchSubmissions(assignmentId: string): Promise<SubmissionRowData[]> {
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select('id, file_url, grade, feedback, submitted_at, student:profiles ( full_name, email )')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  return ((data as any[]) ?? []).map((s) => ({
    id: s.id,
    studentName: s.student?.full_name || s.student?.email || 'Student',
    studentEmail: s.student?.email ?? '',
    fileUrl: s.file_url ?? '',
    submittedAt: formatDate(s.submitted_at),
    grade: s.grade === null || s.grade === undefined ? null : Number(s.grade),
    feedback: s.feedback ?? '',
  }));
}

export async function gradeSubmission(
  submissionId: string,
  grade: number,
  feedback: string
): Promise<void> {
  const { error } = await supabase
    .from('assignment_submissions')
    .update({ grade, feedback: feedback || null })
    .eq('id', submissionId);

  if (error) throw error;
}