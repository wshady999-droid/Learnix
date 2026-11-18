import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Brain, GraduationCap, LineChart, Sparkles } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

const roles = [
  { id: 'admin', label: 'Admin' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
] as const;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<(typeof roles)[number]['id']>('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === 'admin') navigate('/admin');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/student');
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left showcase panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Brain size={22} className="text-white" />
            </span>
            <span className="font-display text-xl font-bold text-white">
              Brain<span className="text-primary-200">Up</span>
            </span>
          </div>
        </div>
        <div className="relative z-10 px-10 pb-10">
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight text-white">
            Where intelligent learning takes off.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
            Courses, quizzes, assignments and an AI study assistant — everything your learning community needs in one platform.
          </p>
          <div className="mt-10 space-y-5">
            {[
              { icon: GraduationCap, text: 'Role-based dashboards for admins, teachers and students' },
              { icon: LineChart, text: 'Real-time progress tracking and performance reports' },
              { icon: Sparkles, text: 'AI study assistant that helps students learn faster' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Icon size={18} className="text-white" />
                </span>
                <p className="text-sm font-medium text-white/90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Welcome back</h2>
            <p className="mt-1.5 text-sm text-gray-500">Sign in to your BrainUp account to continue.</p>

            <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1.5">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                    role === r.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-ink'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="email" type="email" required defaultValue={`alex@brainup.io`} className="input pl-10" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="label">Password</label>
                  <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="password" type={showPassword ? 'text' : 'password'} required defaultValue="brainup123" className="input pl-10 pr-11" placeholder="Enter your password" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign in as {roles.find((r) => r.id === role)?.label}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Contact your administrator</Link>
            </p>
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">© 2026 BrainUp. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
