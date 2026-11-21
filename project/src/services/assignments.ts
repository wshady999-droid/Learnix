import { supabase } from '@/services/supabase';

export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'overdue';

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function computeStatus(
  dueDate: string | null,
  submission: { grade: number | null } | undefined
): AssignmentStatus {
  if (submission) {
    return submission.grade !== null && submission.grade !== undefined ? 'graded' : 'submitted';
  }
  if (dueDate && new Date(dueDate).getTime() < Date.now()) return 'overdue';
  return 'pending';
}

export type AssignmentRow = {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  points: number;
  status: AssignmentStatus;
};

export async function fetchStudentAssignments(userId: string): Promise<AssignmentRow[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('id, title, due_date, points, courses ( title )')
    .order('due_date', { ascending: true });

  if (error) throw error;

  const { data: subs, error: subError } = await supabase
    .from('assignment_submissions')
    .select('assignment_id, grade')
    .eq('student_id', userId);

  if (subError) throw subError;

  const subMap = new Map<string, { grade: number | null }>();
  (subs ?? []).forEach((s: any) => {
    subMap.set(s.assignment_id, {
      grade: s.grade === null || s.grade === undefined ? null : Number(s.grade),
    });
  });

  return ((data as any[]) ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    courseName: a.courses?.title ?? '',
    dueDate: formatDate(a.due_date),
    points: a.points ?? 100,
    status: computeStatus(a.due_date, subMap.get(a.id)),
  }));
}

export type AssignmentDetail = AssignmentRow & {
  description: string;
  hasSubmission: boolean;
  fileUrl: string;
  grade: number | null;
  feedback: string;
  submittedAt: string;
};

export async function fetchAssignmentDetail(
  assignmentId: string,
  userId: string
): Promise<AssignmentDetail | null> {
  const { data: a, error } = await supabase
    .from('assignments')
    .select('id, title, description, due_date, points, courses ( title )')
    .eq('id', assignmentId)
    .maybeSingle();

  if (error) throw error;
  if (!a) return null;

  const row: any = a;

  const { data: sub, error: subError } = await supabase
    .from('assignment_submissions')
    .select('id, file_url, grade, feedback, submitted_at')
    .eq('assignment_id', assignmentId)
    .eq('student_id', userId)
    .maybeSingle();

  if (subError) throw subError;

  const s: any = sub;
  const grade = s && s.grade !== null && s.grade !== undefined ? Number(s.grade) : null;

  return {
    id: row.id,
    title: row.title,
    courseName: row.courses?.title ?? '',
    dueDate: formatDate(row.due_date),
    points: row.points ?? 100,
    status: computeStatus(row.due_date, s ? { grade } : undefined),
    description: row.description ?? '',
    hasSubmission: !!s,
    fileUrl: s?.file_url ?? '',
    grade,
    feedback: s?.feedback ?? '',
    submittedAt: formatDate(s?.submitted_at),
  };
}

export async function submitAssignment(
  assignmentId: string,
  userId: string,
  fileUrl: string
): Promise<void> {
  const { data: existing, error: findError } = await supabase
    .from('assignment_submissions')
    .select('id')
    .eq('assignment_id', assignmentId)
    .eq('student_id', userId)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    const { error } = await supabase
      .from('assignment_submissions')
      .update({ file_url: fileUrl, submitted_at: new Date().toISOString() })
      .eq('id', (existing as any).id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('assignment_submissions').insert({
      assignment_id: assignmentId,
      student_id: userId,
      file_url: fileUrl,
    });
    if (error) throw error;
  }
}