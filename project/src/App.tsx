import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminNav, teacherNav, studentNav } from '@/components/layout/navigation';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import CourseManagement from '@/pages/admin/CourseManagement';
import Categories from '@/pages/admin/Categories';
import Reports from '@/pages/admin/Reports';
import Settings from '@/pages/admin/Settings';

import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import MyCourses from '@/pages/teacher/MyCourses';
import CreateCourse from '@/pages/teacher/CreateCourse';
import CourseDetails from '@/pages/teacher/CourseDetails';
import LessonManagement from '@/pages/teacher/LessonManagement';
import QuizManagement from '@/pages/teacher/QuizManagement';
import TeacherAssignments from '@/pages/teacher/Assignments';
import StudentPerformance from '@/pages/teacher/StudentPerformance';

import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentMyCourses from '@/pages/student/MyCourses';
import StudentCourseDetails from '@/pages/student/StudentCourseDetails';
import Lessons from '@/pages/student/Lessons';
import AvailableQuizzes from '@/pages/student/AvailableQuizzes';
import QuizResults from '@/pages/student/QuizResults';
import StudentAssignments from '@/pages/student/StudentAssignments';
import MyProgress from '@/pages/student/MyProgress';
import AIStudyAssistant from '@/pages/student/AIStudyAssistant';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/admin" element={<DashboardLayout items={adminNav} role="admin" userName="Amelia Hart" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="categories" element={<Categories />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/teacher" element={<DashboardLayout items={teacherNav} role="teacher" userName="Daniel Reyes" />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="courses/new" element={<CreateCourse />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="lessons" element={<LessonManagement />} />
          <Route path="quizzes" element={<QuizManagement />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="students" element={<StudentPerformance />} />
        </Route>

        <Route path="/student" element={<DashboardLayout items={studentNav} role="student" userName="Liam Foster" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentMyCourses />} />
          <Route path="courses/:courseId" element={<StudentCourseDetails />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="quizzes" element={<AvailableQuizzes />} />
          <Route path="results" element={<QuizResults />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="progress" element={<MyProgress />} />
          <Route path="assistant" element={<AIStudyAssistant />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
