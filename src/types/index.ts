export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  courseCount: number;
  color: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'interactive';
  completed?: boolean;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  questions: number;
  duration: number;
  attempts: number;
  avgScore: number;
  status: 'published' | 'draft';
  dueDate?: string;
}

export interface QuizResult {
  id: string;
  quizId?: string;
  studentId: string;
  quizTitle: string;
  courseName: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  submissions?: number;
  totalStudents?: number;
  graded?: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  points: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructorId: string;
  students: number;
  lessons: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'published' | 'draft' | 'archived';
  rating: number;
  progress?: number;
  nextLesson?: string;
  outline?: string[];
  createdAt: string;
  thumbnail: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface StudentPerformance {
  id: string;
  userId: string;
  name: string;
  email: string;
  coursesEnrolled: number;
  avgScore: number;
  completedLessons: number;
  timeSpent: string;
  trend: 'up' | 'down' | 'flat';
}
