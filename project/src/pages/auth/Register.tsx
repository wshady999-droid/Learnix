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
import { supabase } from '@/services/supabase';

type AccountType = 'teacher' | 'student';

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  details: string;
  institution: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

const SUBJECTS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'History', 'Geography', 'Computer Science',
  'Art & Design', 'Physical Education', 'Other',
];

const GRADE_LEVELS = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12', 'Undergraduate', 'Postgraduate', 'Professional',
];

const emptyForm = (): RegisterFormData => ({
  fullName: '',
  email: '',
  phone: '',
  details: '',
  institution: '',
  password: '',
  confirmPassword: '',
});

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Must contain at least one number.';
  return null;
}

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
          autoComplete="new-password"
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

interface RegisterFormProps {
  accountType: AccountType;
  data: RegisterFormData;
  errors: FormErrors;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}

function RegisterForm({ accountType, data, errors, onChange }: RegisterFormProps) {
  const isTeacher = accountType === 'teacher';
  const options = isTeacher ? SUBJECTS : GRADE_LEVELS;

  return (
    <div className="space-y-5 animate-fade-in">
      <Field id="fullName" label="Full name" error={errors.fullName}>
        <div className="relative">
          <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className="input pl-10"
            placeholder={isTeacher ? 'Jane Smith' : 'Alex Johnson'}
            autoComplete="name"
          />
        </div>
      </Field>

      <Field id="email" label="Email address" error={errors.email}>
        <div className="relative">
          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="input pl-10"
            placeholder={isTeacher ? 'jane@school.edu' : 'alex@example.com'}
            autoComplete="email"
          />
        </div>
      </Field>

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
              placeholder="+20 100 000 0000"
              autoComplete="tel"
            />
          </div>
        </Field>

        <Field
          id="details"
          label={isTeacher ? 'Subject / Specialisation' : 'Grade / Study level'}
          error={errors.details}
        >
          <div className="relative">
            {isTeacher ? (
              <BookOpen size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            ) : (
              <Briefcase size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            )}
            <select
              id="details"
              value={data.details}
              onChange={(e) => onChange('details', e.target.value)}
              className="input pl-10 pr-4 appearance-none"
            >
              <option value="" disabled>
                {isTeacher ? 'Select subject' : 'Select level'}
              </option>
              {options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </Field>
      </div>

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

      <PasswordField
        id="password"
        label="Password"
        value={data.password}
        onChange={(v) => onChange('password', v)}
        error={errors.password}
        hint="At least 8 characters, one uppercase, one number."
      />

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

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [accountType, setAccountType] = useState<AccountType>('student');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [data, setData] = useState<RegisterFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleAccountTypeChange = (type: AccountType) => {
    if (type === accountType) return;
    setAccountType(type);
    setGlobalError('');
    setErrors({});
    setData((prev) => ({ ...prev, details: '' }));
  };

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!data.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!data.email.trim()) errs.email = 'Email address is required.';
    else if (!validateEmail(data.email.trim())) errs.email = 'Please enter a valid email address.';
    if (!data.phone.trim()) errs.phone = 'Phone number is required.';
    if (!data.details) {
      errs.details = accountType === 'teacher' ? 'Please select a subject.' : 'Please select your study level.';
    }
    if (!data.institution.trim()) errs.institution = 'Institution is required.';
    const pwErr = validatePassword(data.password);
    if (!data.password) errs.password = 'Password is required.';
    else if (pwErr) errs.password = pwErr;
    if (!data.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName.trim(),
          requested_role: accountType,
          phone: data.phone.trim(),
          institution: data.institution.trim(),
          details: data.details,
        },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already')) setGlobalError('This email is already registered. Try signing in.');
      else if (msg.includes('rate')) setGlobalError('Too many attempts. Please wait a minute and try again.');
      else setGlobalError(error.message);
      setLoading(false);
      return;
    }

    // Make sure the user starts from the sign in page
    await supabase.auth.signOut();
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    const firstName = data.fullName.trim().split(' ')[0];
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-6 py-12"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="btn-ghost fixed right-6 top-6 p-2.5 hover:text-primary"
        >
          {theme === 'dark' ? <Sun size={19} className="text-warning" /> : <Moon size={19} />}
        </button>

        <div className="w-full max-w-md animate-slide-up">
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
              Welcome aboard, {firstName}!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {accountType === 'teacher'
                ? 'Your Teacher account has been created. Check your email and click the confirmation link, then sign in.'
                : 'Your Student account has been created. Check your email and click the confirmation link, then sign in.'}
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary mt-8 w-full py-3">
              Go to sign in <ArrowRight size={16} />
            </button>
          </div>
          <p className="mt-6 text-center text-xs text-muted">© 2026 LearnIx. All rights reserved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Left showcase panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#0B0B0D]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-[#FF3038]/15 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-[#FF3038]" />

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
              { icon: LineChart, text: 'Real-time progress tracking and performance insights' },
              { icon: Sparkles, text: 'AI study assistant that helps students learn faster' },
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

      {/* Right form panel */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="btn-ghost absolute right-6 top-6 p-2.5 hover:text-primary"
        >
          {theme === 'dark' ? <Sun size={19} className="text-warning" /> : <Moon size={19} />}
        </button>

        <div className="w-full max-w-md animate-slide-up">
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
            <p className="mt-1.5 text-sm text-muted">Join LearnIx — choose your role to get started.</p>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-soft p-1.5">
              {(['student', 'teacher'] as AccountType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAccountTypeChange(type)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    accountType === type ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-ink'
                  }`}
                >
                  {type === 'student' ? <GraduationCap size={15} /> : <Briefcase size={15} />}
                  {type === 'teacher' ? 'Teacher' : 'Student'}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-muted">
              {accountType === 'teacher'
                ? 'As a teacher you can create courses, manage lessons, set quizzes and track student performance.'
                : 'As a student you can enrol in courses, complete lessons and quizzes, and track your progress.'}
            </p>

            {globalError && (
              <div
                className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-danger animate-fade-in"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <AlertCircle size={16} className="shrink-0" />
                {globalError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <RegisterForm accountType={accountType} data={data} errors={errors} onChange={handleChange} />

              <button type="submit" disabled={loading} className="btn-primary mt-8 w-full py-3">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </span>
                ) : (
                  <>
                    Create {accountType === 'teacher' ? 'Teacher' : 'Student'} account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

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
