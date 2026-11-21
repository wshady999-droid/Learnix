import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, KeyRound, LogOut } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabase';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setDone(false);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setPassword('');
      setConfirm('');
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? 'Could not change the password.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Appearance and account security." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Appearance</h3>
          <p className="mt-1 text-sm text-muted">Choose how LearnIx looks on this device.</p>
          <button
            onClick={toggleTheme}
            className="mt-5 flex w-full items-center justify-between rounded-xl bg-soft p-4 text-left transition-colors hover:border-primary"
            style={{ border: '1px solid var(--border)' }}
          >
            <span>
              <span className="block text-sm font-medium text-ink">
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </span>
              <span className="block text-xs text-muted">Tap to switch</span>
            </span>
            {theme === 'dark' ? (
              <Moon size={18} className="text-warning" />
            ) : (
              <Sun size={18} className="text-warning" />
            )}
          </button>

          <h3 className="mt-8 font-display text-base font-semibold text-ink">Session</h3>
          <p className="mt-1 text-sm text-muted">Sign out of this device.</p>
          <button onClick={handleSignOut} className="btn-secondary mt-5 text-danger">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-base font-semibold text-ink">Change password</h3>
          <p className="mt-1 text-sm text-muted">Use at least 6 characters.</p>

          {error && (
            <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          {done && (
            <div className="mt-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Password updated.
            </div>
          )}

          <form onSubmit={changePassword} className="mt-5 space-y-4">
            <div>
              <label htmlFor="s-pass" className="label">New password</label>
              <input
                id="s-pass"
                type="password"
                autoComplete="new-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="s-confirm" className="label">Confirm password</label>
              <input
                id="s-confirm"
                type="password"
                autoComplete="new-password"
                className="input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              <KeyRound size={16} /> {saving ? 'Saving...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}