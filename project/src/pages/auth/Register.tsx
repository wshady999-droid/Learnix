import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  LineChart,
  Sparkles,
  Sun,
  Moon,
  User,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Phone,
  School,
  Briefcase,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ───────────────────────────────────────────────────────────────────

type AccountType = 'teacher' | 'student';

interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  institution: string;
  password: string;
  confirmPassword: string;
}

interface StudentFormData {
  fullName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  institution: string;
  password: string;
  confirmPassword: string;
}

type FormErrors<T> = Partial<Record<keyof T, string>>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Must contain at least one number.';
  return null;
}

// ─── Shared input component ───────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger animate-fade-in">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Password field ────────────────────────────────────────────────────────────

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  hint?: React.ReactNode;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = 'Enter your password',
  hint,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label={label} error={error}>
      <div className="relative">
        <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-10 pr-11"
          placeholder={placeholder}
          autoComplete={id === 'password' ? 'new-password' : 'new-password'}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </Field>
  );
}

// ─── Teacher Form ─────────────────────────────────────────────────────────────

const SUBJECTS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'History', 'Geography', 'Computer Science',
  'Art & Design', 'Physical Education', 'Other',
];

interface TeacherFormProps {
  data: TeacherFormData;
  errors: FormErrors<TeacherFormData>;
  onChange: (field: keyof TeacherFormData, value: string) => void;
}

function TeacherForm({ data, errors, onChange }: TeacherFormProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Row 1 – Full name */}
      <Field id="fullName" label="Full name" error={errors.fullName}>
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className="input pl-10"
            placeholder="Jane Smith"
            autoComplete="name"
          />
        </div>
      </Field>

      {/* Row 2 – Email */}
      <Field id="email" label="Email address" error={errors.email}>
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="input pl-10"
            placeholder="jane@school.edu"
            autoComplete="email"
          />
        </div>
      </Field>

      {/* Row 3 – Phone + Subject side-by-side on md+ */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Phone number" error={errors.phone}>
          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="input pl-10"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </div>
        </Field>

        <Field id="subject" label="Subject / Specialisation" error={errors.subject}>
          <div className="relative">
            <BookOpen size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <select
              id="subject"
              value={data.subject}
              onChange={(e) => onChange('subject', e.target.value)}
              className="input pl-10 pr-4 appearance-none"
            >
              <option value="" disabled>Select subject</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </Field>
      </div>

      {/* Row 4 – Institution */}
      <Field id="institution" label="School / Institution" error={errors.institution}>
        <div className="relative">
          <School size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="institution"
            type="text"
            value={data.institution}
            onChange={(e) => onChange('institution', e.target.value)}
            className="input pl-10"
            placeholder="Westfield Academy"
            autoComplete="organization"
          />
        </div>
      </Field>

      {/* Row 5 – Password */}
      <PasswordField
        id="password"
        label="Password"
        value={data.password}
        onChange={(v) => onChange('password', v)}
        error={errors.password}
        hint="At least 8 characters, one uppercase, one number."
      />

      {/* Row 6 – Confirm password */}
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        value={data.confirmPassword}
        onChange={(v) => onChange('confirmPassword', v)}
        error={errors.confirmPassword}
        placeholder="Repeat your password"
      />
    </div>
  );
}

// ─── Student Form ─────────────────────────────────────────────────────────────

const GRADE_LEVELS = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12', 'Undergraduate', 'Postgraduate', 'Professional',
];

interface StudentFormProps {
  data: StudentFormData;
  errors: FormErrors<StudentFormData>;
  onChange: (field: keyof StudentFormData, value: string) => void;
}

function StudentForm({ data, errors, onChange }: StudentFormProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Row 1 – Full name */}
      <Field id="fullName" label="Full name" error={errors.fullName}>
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className="input pl-10"
            placeholder="Alex Johnson"
            autoComplete="name"
          />
        </div>
      </Field>

      {/* Row 2 – Email */}
      <Field id="email" label="Email address" error={errors.email}>
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="input pl-10"
            placeholder="alex@example.com"
            autoComplete="email"
          />
        </div>
      </Field>

      {/* Row 3 – Phone + Grade level */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Phone number" error={errors.phone}>
          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="input pl-10"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </div>
        </Field>

        <Field id="gradeLevel" label="Grade / Study level" error={errors.gradeLevel}>
          <div className="relative">
            <Briefcase size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <select
              id="gradeLevel"
              value={data.gradeLevel}
              onChange={(e) => onChange('gradeLevel', e.target.value)}
              className="input pl-10 pr-4 appearance-none"
            >
              <option value="" disabled>Select level</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </Field>
      </div>

      {/* Row 4 – Institution */}
      <Field id="institution" label="School / Institution" error={errors.institution}>
        <div className="relative">
          <School size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="institution"
            type="text"
            value={data.institution}
            onChange={(e) => onChange('institution', e.target.value)}
            className="input pl-10"
            placeholder="Westfield Academy"
            autoComplete="organization"
          />
        </div>
      </Field>

      {/* Row 5 – Password */}
      <PasswordField
        id="password"
        label="Password"
        value={data.password}
        onChange={(v) => onChange('password', v)}
        error={errors.password}
        hint="At least 8 characters, one uppercase, one number."
      />

      {/* Row 6 – Confirm password */}
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        value={data.confirmPassword}
        onChange={(v) => onChange('confirmPassword', v)}
        error={errors.confirmPassword}
        placeholder="Repeat your password"
      />
    </div>
  );
}

// ─── Default form data factories ──────────────────────────────────────────────

const defaultTeacher = (): TeacherFormData => ({
  fullName: '', email: '', phone: '', subject: '', institution: '', password: '', confirmPassword: '',
});

const defaultStudent = (): StudentFormData => ({
  fullName: '', email: '', phone: '', gradeLevel: '', institution: '', password: '', confirmPassword: '',
});

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [accountType, setAccountType] = useState<AccountType>('student');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Form data per role
  const [teacherData, setTeacherData] = useState<TeacherFormData>(defaultTeacher);
  const [teacherErrors, setTeacherErrors] = useState<FormErrors<TeacherFormData>>({});

  const [studentData, setStudentData] = useState<StudentFormData>(defaultStudent);
  const [studentErrors, setStudentErrors] = useState<FormErrors<StudentFormData>>({});

  // ── Handlers ──

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    setGlobalError('');
    // Reset errors of the form we're leaving so stale errors don't bleed through
    setTeacherErrors({});
    setStudentErrors({});
  };

  const handleTeacherChange = (field: keyof TeacherFormData, value: string) => {
    setTeacherData((prev) => ({ ...prev, [field]: value }));
    if (teacherErrors[field]) setTeacherErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleStudentChange = (field: keyof StudentFormData, value: string) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
    if (studentErrors[field]) setStudentErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Validation ──

  function validateTeacher(): boolean {
    const errs: FormErrors<TeacherFormData> = {};
    if (!teacherData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!teacherData.email.trim()) errs.email = 'Email address is required.';
    else if (!validateEmail(teacherData.email)) errs.email = 'Please enter a valid email address.';
    if (!teacherData.phone.trim()) errs.phone = 'Phone number is required.';
    if (!teacherData.subject) errs.subject = 'Please select a subject.';
    if (!teacherData.institution.trim()) errs.institution = 'Institution is required.';
    const pwErr = validatePassword(teacherData.password);
    if (!teacherData.password) errs.password = 'Password is required.';
    else if (pwErr) errs.password = pwErr;
    if (!teacherData.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (teacherData.password !== teacherData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    setTeacherErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStudent(): boolean {
    const errs: FormErrors<StudentFormData> = {};
    if (!studentData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!studentData.email.trim()) errs.email = 'Email address is required.';
    else if (!validateEmail(studentData.email)) errs.email = 'Please enter a valid email address.';
    if (!studentData.phone.trim()) errs.phone = 'Phone number is required.';
    if (!studentData.gradeLevel) errs.gradeLevel = 'Please select your study level.';
    if (!studentData.institution.trim()) errs.institution = 'Institution is required.';
    const pwErr = validatePassword(studentData.password);
    if (!studentData.password) errs.password = 'Password is required.';
    else if (pwErr) errs.password = pwErr;
    if (!studentData.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (studentData.password !== studentData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    setStudentErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ──

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    const valid = accountType === 'teacher' ? validateTeacher() : validateStudent();
    if (!valid) return;

    setLoading(true);
    // Simulate async registration (frontend-only project)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  // ── Success screen ──
  if (success) {
    const name =
      accountType === 'teacher' ? teacherData.fullName : studentData.fullName;
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-6 py-12"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="btn-ghost fixed right-6 top-6 p-2.5 hover:text-primary"
        >
          {theme === 'dark' ? <Sun size={19} className="text-warning" /> : <Moon size={19} />}
        </button>

        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-primary-glow">
                <GraduationCap size={22} />
              </span>
              <span className="font-display text-xl font-bold text-ink">
                Learn<span className="text-primary">Ix</span>
              </span>
            </div>
          </div>

          <div className="card p-8 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 size={32} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold text-ink">
              Welcome aboard, {name.split(' ')[0]}!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Your{' '}
              <span className="font-semibold text-ink">
                {accountType === 'teacher' ? 'Teacher' : 'Student'}
              </span>{' '}
              account has been created. An admin will review and activate it shortly.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary mt-8 w-full py-3"
            >
              Go to sign in <ArrowRight size={16} />
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-muted">© 2026 LearnIx. All rights reserved.</p>
        </div>
      </div>
    );
  }

  // ── Main render ──
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* ── Left showcase panel (hidden on mobile / tablet) ── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#0B0B0D]">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-[#FF3038]/15 blur-3xl" />
        {/* Top accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-[#FF3038]" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-primary-glow">
              <GraduationCap size={22} />
            </span>
            <span className="font-display text-xl font-bold text-white">
              Learn<span className="text-primary">Ix</span>
            </span>
          </div>
        </div>

        {/* Bottom copy */}
        <div className="relative z-10 px-10 pb-10">
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight text-white">
            Start your journey with LearnIx today.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
            Join thousands of teachers and students on the platform built for intelligent, collaborative learning.
          </p>
          <div className="mt-10 space-y-5">
            {[
              { icon: GraduationCap, text: 'Role-based dashboards for teachers and students' },
              { icon: LineChart,     text: 'Real-time progress tracking and performance insights' },
              { icon: Sparkles,      text: 'AI study assistant that helps students learn faster' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <Icon size={18} className="text-[#FF3038]" />
                </span>
                <p className="text-sm font-medium text-white/90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="btn-ghost absolute right-6 top-6 p-2.5 hover:text-primary"
        >
          {theme === 'dark' ? <Sun size={19} className="text-warning" /> : <Moon size={19} />}
        </button>

        <div className="w-full max-w-md animate-slide-up">
          {/* Logo (mobile-only — hidden on lg because it shows in the left panel) */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-primary-glow">
                <GraduationCap size={22} />
              </span>
              <span className="font-display text-xl font-bold text-ink">
                Learn<span className="text-primary">Ix</span>
              </span>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Create your account</h2>
            <p className="mt-1.5 text-sm text-muted">
              Join LearnIx — choose your role to get started.
            </p>

            {/* ── Account type selector ── */}
            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-soft p-1.5">
              {(['student', 'teacher'] as AccountType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAccountTypeChange(type)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    accountType === type
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {type === 'student' ? <GraduationCap size={15} /> : <Briefcase size={15} />}
                  {type === 'teacher' ? 'Teacher' : 'Student'}
                </button>
              ))}
            </div>

            {/* Role description badge */}
            <p className="mt-3 text-xs text-muted">
              {accountType === 'teacher'
                ? 'As a teacher you can create courses, manage lessons, set quizzes and track student performance.'
                : 'As a student you can enrol in courses, complete lessons and quizzes, and track your progress.'}
            </p>

            {/* ── Global error ── */}
            {globalError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-danger animate-fade-in"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} className="shrink-0" />
                {globalError}
              </div>
            )}

            {/* ── Dynamic form ── */}
            <form onSubmit={handleSubmit} noValidate className="mt-6">
              {accountType === 'teacher' ? (
                <TeacherForm
                  data={teacherData}
                  errors={teacherErrors}
                  onChange={handleTeacherChange}
                />
              ) : (
                <StudentForm
                  data={studentData}
                  errors={studentErrors}
                  onChange={handleStudentChange}
                />
              )}

              {/* ── Submit button ── */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-8 w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account…
                  </span>
                ) : (
                  <>
                    Create {accountType === 'teacher' ? 'Teacher' : 'Student'} account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* ── Footer links ── */}
            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted">© 2026 LearnIx. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
