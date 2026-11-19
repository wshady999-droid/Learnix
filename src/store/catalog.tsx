import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  assignments as seedAssignments,
  categories as seedCategories,
  courses as seedCourses,
  lessons as seedLessons,
  notifications as seedNotifications,
  quizResults as seedResults,
  quizzes as seedQuizzes,
  studentPerformance as seedPerformance,
  users as seedUsers,
} from '@/services/mockData';
import type {
  Assignment,
  Category,
  Course,
  Lesson,
  Notification,
  Quiz,
  QuizResult,
  User,
} from '@/types';

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  confirmEmails: boolean;
  strongPasswords: boolean;
  twoFactor: boolean;
  weeklySummary: boolean;
  newSignups: boolean;
}

const SETTINGS_KEY = 'learnix-settings';

const defaultSettings: PlatformSettings = {
  siteName: 'LearnIx',
  supportEmail: 'support@learnix.io',
  confirmEmails: true,
  strongPasswords: true,
  twoFactor: false,
  weeklySummary: true,
  newSignups: true,
};

function loadSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

interface CatalogValue {
  users: User[];
  courses: Course[];
  categories: Category[];
  lessons: Lesson[];
  quizzes: Quiz[];
  assignments: Assignment[];
  notifications: Notification[];
  quizResults: QuizResult[];
  studentPerformance: typeof seedPerformance;
  settings: PlatformSettings;
  addUser: (input: Pick<User, 'name' | 'email' | 'role'>) => void;
  updateUser: (id: string, patch: Partial<Pick<User, 'name' | 'email' | 'role' | 'status'>>) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  addCategory: (input: Pick<Category, 'name' | 'description' | 'color'>) => 'ok' | 'duplicate' | 'empty';
  updateCategory: (id: string, patch: Pick<Category, 'name' | 'description'>) => 'ok' | 'duplicate' | 'empty' | 'missing';
  deleteCategory: (id: string) => 'ok' | 'in-use' | 'missing';
  addLesson: (input: Pick<Lesson, 'title' | 'type' | 'duration'>) => void;
  updateLesson: (id: string, patch: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  addQuiz: (input: Pick<Quiz, 'title' | 'courseName' | 'courseId' | 'questions' | 'duration'>) => void;
  updateQuiz: (id: string, patch: Partial<Quiz>) => void;
  addAssignment: (input: Pick<Assignment, 'title' | 'courseName' | 'dueDate' | 'points'>) => void;
  updateAssignment: (id: string, patch: Partial<Assignment>) => void;
  addQuizResult: (input: Omit<QuizResult, 'id'>) => void;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  saveSettings: (next: PlatformSettings) => void;
}

const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [courses, setCourses] = useState<Course[]>(seedCourses);
  const [categoryRows, setCategoryRows] = useState<Category[]>(seedCategories);
  const [lessons, setLessons] = useState<Lesson[]>(seedLessons);
  const [quizzes, setQuizzes] = useState<Quiz[]>(seedQuizzes);
  const [assignments, setAssignments] = useState<Assignment[]>(seedAssignments);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(seedResults);
  const [settings, setSettings] = useState<PlatformSettings>(loadSettings);

  const categories = useMemo(
    () => categoryRows.map((category) => ({
      ...category,
      courseCount: courses.filter((course) => course.category === category.name).length,
    })),
    [categoryRows, courses],
  );

  const value = useMemo<CatalogValue>(() => ({
    users,
    courses,
    categories,
    lessons,
    quizzes,
    assignments,
    notifications,
    quizResults,
    studentPerformance: seedPerformance,
    settings,
    addUser: (input) => {
      setUsers((list) => [{
        id: `u${Date.now()}`,
        name: input.name.trim(),
        email: input.email.trim(),
        role: input.role,
        status: 'active',
        joinedAt: new Date().toISOString().slice(0, 10),
      }, ...list]);
    },
    updateUser: (id, patch) => {
      setUsers((list) => list.map((user) => (user.id === id ? { ...user, ...patch } : user)));
    },
    addCourse: (course) => setCourses((list) => [course, ...list]),
    updateCourse: (id, patch) => {
      setCourses((list) => list.map((course) => (course.id === id ? { ...course, ...patch } : course)));
    },
    addCategory: (input) => {
      const name = input.name.trim();
      if (!name) return 'empty';
      if (categoryRows.some((category) => category.name.toLowerCase() === name.toLowerCase())) return 'duplicate';
      setCategoryRows((list) => [...list, {
        id: `c${Date.now()}`,
        name,
        description: input.description.trim(),
        color: input.color,
        courseCount: 0,
      }]);
      return 'ok';
    },
    updateCategory: (id, patch) => {
      const current = categoryRows.find((category) => category.id === id);
      if (!current) return 'missing';
      const name = patch.name.trim();
      if (!name) return 'empty';
      const duplicate = categoryRows.some((category) => category.id !== id && category.name.toLowerCase() === name.toLowerCase());
      if (duplicate) return 'duplicate';
      if (current.name !== name) {
        setCourses((list) => list.map((course) => (
          course.category === current.name ? { ...course, category: name } : course
        )));
      }
      setCategoryRows((list) => list.map((category) => (
        category.id === id ? { ...category, name, description: patch.description.trim() } : category
      )));
      return 'ok';
    },
    deleteCategory: (id) => {
      const current = categoryRows.find((category) => category.id === id);
      if (!current) return 'missing';
      if (courses.some((course) => course.category === current.name)) return 'in-use';
      setCategoryRows((list) => list.filter((category) => category.id !== id));
      return 'ok';
    },
    addLesson: (input) => {
      setLessons((list) => [...list, {
        id: `l${Date.now()}`,
        title: input.title.trim(),
        type: input.type,
        duration: input.duration.trim() || '20 min',
        order: list.length + 1,
        completed: false,
      }]);
    },
    updateLesson: (id, patch) => {
      setLessons((list) => list.map((lesson) => (lesson.id === id ? { ...lesson, ...patch } : lesson)));
    },
    deleteLesson: (id) => {
      setLessons((list) => list.filter((lesson) => lesson.id !== id).map((lesson, index) => ({ ...lesson, order: index + 1 })));
    },
    addQuiz: (input) => {
      setQuizzes((list) => [{
        id: `q${Date.now()}`,
        title: input.title.trim(),
        courseId: input.courseId,
        courseName: input.courseName,
        questions: input.questions,
        duration: input.duration,
        attempts: 0,
        avgScore: 0,
        status: 'draft',
      }, ...list]);
    },
    updateQuiz: (id, patch) => {
      setQuizzes((list) => list.map((quiz) => (quiz.id === id ? { ...quiz, ...patch } : quiz)));
    },
    addAssignment: (input) => {
      setAssignments((list) => [{
        id: `a${Date.now()}`,
        title: input.title.trim(),
        courseName: input.courseName,
        dueDate: input.dueDate,
        points: input.points,
        submissions: 0,
        totalStudents: 0,
        graded: 0,
        status: 'pending',
      }, ...list]);
    },
    updateAssignment: (id, patch) => {
      setAssignments((list) => list.map((assignment) => (
        assignment.id === id ? { ...assignment, ...patch } : assignment
      )));
    },
    addQuizResult: (input) => {
      setQuizResults((list) => [{ id: `r${Date.now()}`, ...input }, ...list]);
    },
    dismissNotification: (id) => setNotifications((list) => list.filter((item) => item.id !== id)),
    markNotificationRead: (id) => {
      setNotifications((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)));
    },
    markAllNotificationsRead: () => setNotifications((list) => list.map((item) => ({ ...item, read: true }))),
    saveSettings: (next) => {
      setSettings(next);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    },
  }), [assignments, categories, categoryRows, courses, lessons, notifications, quizResults, quizzes, settings, users]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
