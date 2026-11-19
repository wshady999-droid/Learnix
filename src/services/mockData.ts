/** Local demo catalog. Nothing in this file is loaded from a database. */
import type {
  Assignment,
  Category,
  Course,
  Notification,
  Quiz,
  QuizResult,
  StudentPerformance,
  User,
} from '@/types';

export const users: User[] = [
  { id: 'u1', name: 'Amelia Hart', email: 'amelia.hart@learnix.io', role: 'admin', status: 'active', joinedAt: '2024-01-12' },
  { id: 'u2', name: 'Daniel Reyes', email: 'daniel.reyes@learnix.io', role: 'teacher', status: 'active', joinedAt: '2024-02-03' },
  { id: 'u3', name: 'Sofia Nguyen', email: 'sofia.nguyen@learnix.io', role: 'teacher', status: 'active', joinedAt: '2024-03-18' },
  { id: 'u4', name: 'Liam Foster', email: 'liam.foster@student.learnix.io', role: 'student', status: 'active', joinedAt: '2024-04-22' },
  { id: 'u5', name: 'Maya Patel', email: 'maya.patel@student.learnix.io', role: 'student', status: 'active', joinedAt: '2024-05-09' },
  { id: 'u6', name: 'Noah Kim', email: 'noah.kim@student.learnix.io', role: 'student', status: 'suspended', joinedAt: '2024-05-30' },
  { id: 'u7', name: 'Isabella Moreau', email: 'isabella.m@student.learnix.io', role: 'student', status: 'pending', joinedAt: '2024-06-14' },
  { id: 'u8', name: 'Ethan Brooks', email: 'ethan.brooks@student.learnix.io', role: 'student', status: 'active', joinedAt: '2024-07-01' },
];

export const categories: Category[] = [
  { id: 'c1', name: 'Web Development', description: 'Frontend and backend development courses', courseCount: 24, color: '#5B5FEF' },
  { id: 'c2', name: 'Data Science', description: 'Analytics, ML and statistics', courseCount: 16, color: '#22C55E' },
  { id: 'c3', name: 'Design', description: 'UX, UI and visual design', courseCount: 12, color: '#F59E0B' },
  { id: 'c4', name: 'Business', description: 'Entrepreneurship and management', courseCount: 9, color: '#7C83FD' },
  { id: 'c5', name: 'Marketing', description: 'Digital marketing and growth', courseCount: 7, color: '#EF4444' },
];

const thumbnail = (seed: string) =>
  `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=640`;

export const courses: Course[] = [
  {
    id: 'co1', title: 'React Fundamentals', description: 'Master components, hooks and state management with hands-on projects.',
    category: 'Web Development', instructor: 'Daniel Reyes', instructorId: 'u2', students: 342, lessons: 24,
    duration: '12h 30m', level: 'Beginner', status: 'published', rating: 4.8, createdAt: '2024-03-02',
    thumbnail: thumbnail('1103970'),
  },
  {
    id: 'co2', title: 'Advanced TypeScript Patterns', description: 'Generics, utility types and type-level programming in depth.',
    category: 'Web Development', instructor: 'Sofia Nguyen', instructorId: 'u3', students: 189, lessons: 18,
    duration: '9h 45m', level: 'Advanced', status: 'published', rating: 4.6, progress: 42,
    nextLesson: 'Conditional Types in Practice', createdAt: '2024-04-11', thumbnail: thumbnail('1181671'),
  },
  {
    id: 'co3', title: 'Data Visualization with D3', description: 'Turn raw data into compelling, interactive visual stories.',
    category: 'Data Science', instructor: 'Daniel Reyes', instructorId: 'u2', students: 264, lessons: 20,
    duration: '10h 15m', level: 'Intermediate', status: 'published', rating: 4.7, progress: 78,
    nextLesson: 'Force-Directed Graphs', createdAt: '2024-02-20', thumbnail: thumbnail('669615'),
  },
  {
    id: 'co4', title: 'UX Design Essentials', description: 'Research, wireframing and usability testing from first principles.',
    category: 'Design', instructor: 'Sofia Nguyen', instructorId: 'u3', students: 421, lessons: 16,
    duration: '8h', level: 'Beginner', status: 'published', rating: 4.9, progress: 15,
    nextLesson: 'User Interview Techniques', createdAt: '2024-01-28', thumbnail: thumbnail('3183150'),
  },
  {
    id: 'co5', title: 'Python for Data Analysis', description: 'Pandas, NumPy and real-world datasets from day one.',
    category: 'Data Science', instructor: 'Daniel Reyes', instructorId: 'u2', students: 512, lessons: 30,
    duration: '15h 20m', level: 'Intermediate', status: 'published', rating: 4.8, createdAt: '2024-05-06',
    thumbnail: thumbnail('5775855'),
  },
  {
    id: 'co6', title: 'Digital Marketing Strategy', description: 'Build a full-funnel marketing plan that actually converts.',
    category: 'Marketing', instructor: 'Sofia Nguyen', instructorId: 'u3', students: 158, lessons: 14,
    duration: '7h 10m', level: 'Beginner', status: 'draft', rating: 4.4, createdAt: '2024-06-19',
    thumbnail: thumbnail('6801648'),
  },
];

export const lessons = [
  { id: 'l1', title: 'Introduction to Components', duration: '18 min', type: 'video' as const, completed: true, order: 1 },
  { id: 'l2', title: 'Props and State Deep Dive', duration: '32 min', type: 'video' as const, completed: true, order: 2 },
  { id: 'l3', title: 'Reading: The Mental Model of Hooks', duration: '15 min', type: 'reading' as const, completed: true, order: 3 },
  { id: 'l4', title: 'useEffect in Practice', duration: '28 min', type: 'video' as const, completed: true, order: 4 },
  { id: 'l5', title: 'Building a Custom Hook', duration: '24 min', type: 'interactive' as const, completed: false, order: 5 },
  { id: 'l6', title: 'Context and Providers', duration: '21 min', type: 'video' as const, completed: false, order: 6 },
  { id: 'l7', title: 'Performance: memo and Keys', duration: '26 min', type: 'video' as const, completed: false, order: 7 },
];

export const quizzes: Quiz[] = [
  { id: 'q1', title: 'React Basics Checkpoint', courseId: 'co1', courseName: 'React Fundamentals', questions: 12, duration: 25, attempts: 210, avgScore: 82, status: 'published', dueDate: '2026-11-25' },
  { id: 'q2', title: 'Hooks & Effects Quiz', courseId: 'co1', courseName: 'React Fundamentals', questions: 15, duration: 30, attempts: 164, avgScore: 76, status: 'published' },
  { id: 'q3', title: 'Type Systems Midterm', courseId: 'co2', courseName: 'Advanced TypeScript Patterns', questions: 20, duration: 45, attempts: 95, avgScore: 71, status: 'published', dueDate: '2026-12-02' },
  { id: 'q4', title: 'SVG & Scales Warm-up', courseId: 'co3', courseName: 'Data Visualization with D3', questions: 10, duration: 20, attempts: 88, avgScore: 88, status: 'draft' },
];

export const quizResults: QuizResult[] = [
  { id: 'r1', quizId: 'q1', studentId: 'u4', quizTitle: 'React Basics Checkpoint', courseName: 'React Fundamentals', score: 11, total: 12, percentage: 92, completedAt: '2026-11-10' },
  { id: 'r2', quizId: 'q2', studentId: 'u4', quizTitle: 'Hooks & Effects Quiz', courseName: 'React Fundamentals', score: 12, total: 15, percentage: 80, completedAt: '2026-11-05' },
  { id: 'r3', quizId: 'q3', studentId: 'u4', quizTitle: 'Type Systems Midterm', courseName: 'Advanced TypeScript Patterns', score: 14, total: 20, percentage: 70, completedAt: '2026-10-28' },
  { id: 'r4', studentId: 'u5', quizTitle: 'UX Heuristics Quiz', courseName: 'UX Design Essentials', score: 9, total: 10, percentage: 90, completedAt: '2026-10-15' },
];

export const assignments: Assignment[] = [
  { id: 'a1', title: 'Build a Todo App with Hooks', courseName: 'React Fundamentals', dueDate: '2026-11-28', submissions: 289, totalStudents: 342, graded: 240, points: 100, status: 'pending' },
  { id: 'a2', title: 'Type-Safe API Client', courseName: 'Advanced TypeScript Patterns', dueDate: '2026-12-05', submissions: 96, totalStudents: 189, graded: 40, points: 50, status: 'submitted' },
  { id: 'a3', title: 'Design a Landing Page', courseName: 'UX Design Essentials', dueDate: '2026-11-12', points: 100, status: 'graded' },
  { id: 'a4', title: 'Charting Exercise', courseName: 'Data Visualization with D3', dueDate: '2026-11-08', points: 40, status: 'overdue' },
];

export const studentPerformance: StudentPerformance[] = [
  { id: 'sp1', userId: 'u4', name: 'Liam Foster', email: 'liam.foster@student.learnix.io', coursesEnrolled: 4, avgScore: 91, completedLessons: 62, timeSpent: '38h', trend: 'up' },
  { id: 'sp2', userId: 'u5', name: 'Maya Patel', email: 'maya.patel@student.learnix.io', coursesEnrolled: 3, avgScore: 84, completedLessons: 51, timeSpent: '31h', trend: 'up' },
  { id: 'sp3', userId: 'u8', name: 'Ethan Brooks', email: 'ethan.brooks@student.learnix.io', coursesEnrolled: 5, avgScore: 78, completedLessons: 44, timeSpent: '27h', trend: 'flat' },
  { id: 'sp4', userId: 'u6', name: 'Noah Kim', email: 'noah.kim@student.learnix.io', coursesEnrolled: 2, avgScore: 63, completedLessons: 18, timeSpent: '9h', trend: 'down' },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'New submission', message: 'Liam Foster submitted "Build a Todo App with Hooks"', time: '5 min ago', read: false, type: 'info' },
  { id: 'n2', title: 'Quiz completed', message: 'Maya Patel scored 88% on "React Basics Checkpoint"', time: '1 hour ago', read: false, type: 'success' },
  { id: 'n3', title: 'Deadline approaching', message: '"Type-Safe API Client" is due in 3 days', time: '3 hours ago', read: false, type: 'warning' },
  { id: 'n4', title: 'Course published', message: '"Python for Data Analysis" is now live', time: 'Yesterday', read: true, type: 'success' },
];

export const weeklyActivity = [
  { day: 'Mon', hours: 2.5, lessons: 4 },
  { day: 'Tue', hours: 3.2, lessons: 5 },
  { day: 'Wed', hours: 1.8, lessons: 3 },
  { day: 'Thu', hours: 4.1, lessons: 6 },
  { day: 'Fri', hours: 2.9, lessons: 4 },
  { day: 'Sat', hours: 3.6, lessons: 5 },
  { day: 'Sun', hours: 2.2, lessons: 3 },
];

export const enrollmentTrend = [
  { month: 'Jun', students: 620, courses: 60 },
  { month: 'Jul', students: 705, courses: 64 },
  { month: 'Aug', students: 810, courses: 68 },
  { month: 'Sep', students: 958, courses: 72 },
  { month: 'Oct', students: 1104, courses: 78 },
  { month: 'Nov', students: 1265, courses: 82 },
];
