import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Save, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { fetchMyProfile, updateMyProfile } from '@/services/profile';

export default function StudentProfile() {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMyProfile(profile.id);
        if (cancelled || !data) return;
        setName(data.fullName);
        setEmail(data.email);
        setPhone(data.phone);
        setInstitution(data.institution);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load your profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      setSaved(false);
      await updateMyProfile(profile.id, {
        fullName: name.trim(),
        phone: phone.trim(),
        institution: institution.trim(),
      });
      setSaved(true);
      setTimeout(() => window.location.reload(), 700);
    } catch (err: any) {
      setError(err?.message ?? 'Could not save your profile.');
      setSaving(false);
    }
  };

  const initials =
    (name || email || 'U')
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details." />

      {error && (
        <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">
              {initials}
            </span>
            <div>
              <p className="font-display text-base font-semibold text-ink">{name || email}</p>
              <p className="text-sm text-muted">Student</p>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-muted">Loading...</p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={save}>
              <div>
                <label htmlFor="p-name" className="label">Name</label>
                <input id="p-name" required className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="p-email" className="label">Email</label>
                <input id="p-email" type="email" className="input opacity-70" value={email} readOnly />
              </div>
              <div>
                <label htmlFor="p-phone" className="label">Phone</label>
                <input id="p-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label htmlFor="p-inst" className="label">School / Institution</label>
                <input id="p-inst" className="input" value={institution} onChange={(e) => setInstitution(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" disabled={saving}>
                <Save size={16} /> {saved ? 'Saved' : saving ? 'Saving...' : 'Save'}
              </button>
            </form>
          )}
        </div>

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
        </div>
      </div>
    </>
  );
}