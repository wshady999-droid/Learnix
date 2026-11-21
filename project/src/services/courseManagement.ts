import { supabase } from '@/services/supabase';

const FALLBACK_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E50914"/><stop offset="1" stop-color="#7a0510"/></linearGradient></defs><rect width="400" height="225" fill="url(#g)"/></svg>'
  );

const LESSON_BUCKET = 'lesson-files';

export const MAX_LESSON_FILE_MB = 50;

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
  filePath: string;
  fileType: string;
  fileName: string;
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
    filePath: l.file_path ?? '',
    fileType: l.file_type ?? '',
    fileName: l.file_name ?? '',
  };
}

export async function fetchLessons(courseId: string): Promise<ManagedLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, type, duration_minutes, video_url, position, file_path, file_type, file_name')
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

type UploadedFile = { path: string; type: string; name: string };

async function uploadLessonFile(
  courseId: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedFile> {
  if (file.size > MAX_LESSON_FILE_MB * 1024 * 1024) {
    throw new Error(`File is too large. The maximum is ${MAX_LESSON_FILE_MB} MB.`);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${courseId}/${crypto.randomUUID()}-${safeName}`;

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('Your session expired. Please sign in again.');

  const encodedPath = path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${LESSON_BUCKET}/${encodedPath}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_ANON_KEY);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      let message = 'Upload failed.';
      try {
        const parsed = JSON.parse(xhr.responseText);
        message = parsed.message || parsed.error || message;
      } catch {
        // keep the default message
      }
      reject(new Error(message));
    };

    xhr.onerror = () => reject(new Error('Network error while uploading the file.'));
    xhr.send(file);
  });

  return { path, type: file.type || '', name: file.name };
}

async function removeLessonFile(path: string): Promise<void> {
  if (!path) return;
  try {
    await supabase.storage.from(LESSON_BUCKET).remove([path]);
  } catch {
    // best effort: a leftover file is not worth failing the whole action
  }
}

export async function addLesson(
  courseId: string,
  input: LessonInput,
  position: number,
  file?: File | null,
  onProgress?: (percent: number) => void
): Promise<void> {
  let uploaded: UploadedFile | null = null;

  if (file) {
    uploaded = await uploadLessonFile(courseId, file, onProgress);
  }

  const { error } = await supabase.from('lessons').insert({
    course_id: courseId,
    title: input.title,
    type: input.type,
    duration_minutes: input.durationMinutes,
    video_url: input.videoUrl || null,
    position,
    file_path: uploaded?.path ?? null,
    file_type: uploaded?.type ?? null,
    file_name: uploaded?.name ?? null,
  });

  if (error) {
    if (uploaded) await removeLessonFile(uploaded.path);
    throw error;
  }
}

export type UpdateLessonOptions = {
  courseId: string;
  file?: File | null;
  oldFilePath?: string;
  onProgress?: (percent: number) => void;
};

export async function updateLesson(
  lessonId: string,
  input: LessonInput,
  options?: UpdateLessonOptions
): Promise<void> {
  let uploaded: UploadedFile | null = null;

  if (options?.file) {
    uploaded = await uploadLessonFile(options.courseId, options.file, options.onProgress);
  }

  const changes: Record<string, unknown> = {
    title: input.title,
    type: input.type,
    duration_minutes: input.durationMinutes,
    video_url: input.videoUrl || null,
  };

  if (uploaded) {
    changes.file_path = uploaded.path;
    changes.file_type = uploaded.type;
    changes.file_name = uploaded.name;
  }

  const { error } = await supabase.from('lessons').update(changes).eq('id', lessonId);

  if (error) {
    if (uploaded) await removeLessonFile(uploaded.path);
    throw error;
  }

  if (uploaded && options?.oldFilePath) {
    await removeLessonFile(options.oldFilePath);
  }
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const { data: row } = await supabase
    .from('lessons')
    .select('file_path')
    .eq('id', lessonId)
    .maybeSingle();

  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;

  const filePath = (row as any)?.file_path as string | null | undefined;
  if (filePath) await removeLessonFile(filePath);
}