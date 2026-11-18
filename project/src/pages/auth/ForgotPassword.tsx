import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <CheckCircle2 size={28} />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-ink">Check your inbox</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                If an account exists for <span className="font-semibold text-ink">{email}</span>, you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary mt-7 w-full py-3">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-ink">Forgot your password?</h2>
              <p className="mt-1.5 text-sm text-gray-500">
                No worries. Enter the email linked to your account and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="label">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-3">Send reset link</button>
              </form>
              <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-ink">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">© 2026 BrainUp. All rights reserved.</p>
      </div>
    </div>
  );
}
