import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Save, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function StudentProfile() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('Liam Foster');
  const [email, setEmail] = useState('liam.foster@student.learnix.io');

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Your account details."
        actions={<button className="btn-primary" onClick={() => alert('Profile saved (demo).')}><Save size={16} /> Save</button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">
              {name.split(' ').map((p) => p[0]).join('')}
            </span>
            <div>
              <p className="font-display text-base font-semibold text-ink">{name}</p>
              <p className="text-sm text-muted">Student</p>
            </div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Profile saved (demo).'); }}>
            <div>
              <label htmlFor="p-name" className="label">Name</label>
              <input id="p-name" required className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="p-email" className="label">Email</label>
              <input id="p-email" required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </form>
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
              <span className="block text-sm font-medium text-ink">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
              <span className="block text-xs text-muted">Tap to switch</span>
            </span>
            {theme === 'dark' ? <Moon size={18} className="text-warning" /> : <Sun size={18} className="text-warning" />}
          </button>
        </div>
      </div>
    </>
  );
}
