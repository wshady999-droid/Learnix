import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminNav, teacherNav, studentNav } from '@/components/layout/navigation';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

import ProfilePage from '@/pages/common/ProfilePage';
import AccountSettings from '@/pages/common/AccountSettings';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import UserDetails from '@/pages/admin/UserDetails';
import CourseManagement from '@/pages/admin/CourseManagement';
import Categories from '@/pages/admin/Categories';
import Reports from '@/pages/admin/Reports';
import Settings from '@/pages/admin/Settings';

import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import MyCourses from '@/pages/teacher/MyCourses';
import CreateCourse from '@/pages/teacher/CreateCourse';
import EditCourse from '@/pages/teacher/EditCourse';
import CourseDetails from '@/pages/teacher/CourseDetails';
import LessonManagement from '@/pages/teacher/LessonManagement';
import QuizManagement from '@/pages/teacher/QuizManagement';
import TeacherAssignments from '@/pages/teacher/Assignments';
import StudentPerformance from '@/pages/teacher/StudentPerformance';
import StudentDetails from '@/pages/teacher/StudentDetails';
import TeacherAssistant from '@/pages/teacher/TeacherAssistant';

import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentMyCourses from '@/pages/student/MyCourses';
import BrowseCourses from '@/pages/student/BrowseCourses';
import StudentCourseDetails from '@/pages/student/StudentCourseDetails';
import Lessons from '@/pages/student/Lessons';
import StudentLessons from '@/pages/student/StudentLessons';
import LessonPlayer from '@/pages/student/LessonPlayer';
import AvailableQuizzes from '@/pages/student/AvailableQuizzes';
import QuizTaking from '@/pages/student/QuizTaking';
import QuizResults from '@/pages/student/QuizResults';
import StudentAssignments from '@/pages/student/StudentAssignments';
import AssignmentDetails from '@/pages/student/AssignmentDetails';
import MyProgress from '@/pages/student/MyProgress';
import AIStudyAssistant from '@/pages/student/AIStudyAssistant';
import StudentNotifications from '@/pages/student/StudentNotifications';
import StudentProfile from '@/pages/student/StudentProfile';

export default function App() {
  const { profile } = useAuth();
  const userName = profile?.full_name || profile?.email || 'User';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute allow="admin" />}>
          <Route path="/admin" element={<DashboardLayout items={adminNav} role="admin" userName={userName} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/:userId" element={<UserDetails />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="categories" element={<Categories />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allow="teacher" />}>
          <Route path="/teacher" element={<DashboardLayout items={teacherNav} role="teacher" userName={userName} />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="courses/new" element={<CreateCourse />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route path="courses/:courseId/edit" element={<EditCourse />} />
            <Route path="lessons" element={<LessonManagement />} />
            <Route path="quizzes" element={<QuizManagement />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="students" element={<StudentPerformance />} />
            <Route path="students/:studentId" element={<StudentDetails />} />
            <Route path="profile" element={<ProfilePage roleLabel="Teacher" />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="assistant" element={<TeacherAssistant />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allow="student" />}>
          <Route path="/student" element={<DashboardLayout items={studentNav} role="student" userName={userName} />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentMyCourses />} />
            <Route path="browse" element={<BrowseCourses />} />
            <Route path="courses/:courseId" element={<StudentCourseDetails />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="lessons/:courseId" element={<StudentLessons />} />
            <Route path="lessons/:courseId/:lessonId" element={<LessonPlayer />} />
            <Route path="quizzes" element={<AvailableQuizzes />} />
            <Route path="quizzes/:quizId" element={<QuizTaking />} />
            <Route path="results" element={<QuizResults />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="assignments/:assignmentId" element={<AssignmentDetails />} />
            <Route path="progress" element={<MyProgress />} />
            <Route path="assistant" element={<AIStudyAssistant />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}