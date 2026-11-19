export interface NavItem {
  label: string;
  to: string;
  icon: string;
  end?: boolean;
}

export function isItemActive(pathname: string, item: NavItem) {
  if (item.to === '/teacher/courses') {
    return pathname === item.to || /^\/teacher\/courses\/(?!new$).+/.test(pathname);
  }
  if (item.end) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export const roleHome: Record<'admin' | 'teacher' | 'student', string> = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};

export const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: 'LayoutDashboard', end: true },
  { label: 'User Management', to: '/admin/users', icon: 'Users' },
  { label: 'Course Management', to: '/admin/courses', icon: 'BookOpen' },
  { label: 'Categories', to: '/admin/categories', icon: 'Tags' },
  { label: 'Reports', to: '/admin/reports', icon: 'BarChart3' },
  { label: 'Settings', to: '/admin/settings', icon: 'Settings' },
];

export const teacherNav: NavItem[] = [
  { label: 'Dashboard', to: '/teacher', icon: 'LayoutDashboard', end: true },
  { label: 'My Courses', to: '/teacher/courses', icon: 'BookOpen' },
  { label: 'Create Course', to: '/teacher/courses/new', icon: 'FilePlus2', end: true },
  { label: 'Lesson Management', to: '/teacher/lessons', icon: 'PlayCircle' },
  { label: 'Quiz Management', to: '/teacher/quizzes', icon: 'ClipboardList' },
  { label: 'Assignments', to: '/teacher/assignments', icon: 'FileText' },
  { label: 'Student Performance', to: '/teacher/students', icon: 'TrendingUp' },
];

export const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student', icon: 'LayoutDashboard', end: true },
  { label: 'My Courses', to: '/student/courses', icon: 'BookOpen' },
  { label: 'Lessons', to: '/student/lessons', icon: 'PlayCircle' },
  { label: 'Available Quizzes', to: '/student/quizzes', icon: 'ClipboardList' },
  { label: 'Quiz Results', to: '/student/results', icon: 'Award' },
  { label: 'Assignments', to: '/student/assignments', icon: 'FileText' },
  { label: 'My Progress', to: '/student/progress', icon: 'TrendingUp' },
  { label: 'AI Study Assistant', to: '/student/assistant', icon: 'Sparkles' },
  { label: 'Notifications', to: '/student/notifications', icon: 'Bell' },
  { label: 'Profile', to: '/student/profile', icon: 'User' },
];
