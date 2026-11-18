import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Save, Shield, Bell, Globe, Palette } from 'lucide-react';

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${on ? 'bg-primary-600' : 'bg-gray-300'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Configure platform-wide preferences."
        actions={<button className="btn-primary"><Save size={16} /> Save changes</button>}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Globe size={18} /></span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">General</h3>
              <p className="text-xs text-gray-400">Platform identity</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="site-name" className="label">Platform name</label>
              <input id="site-name" className="input" defaultValue="BrainUp" />
            </div>
            <div>
              <label htmlFor="support-email" className="label">Support email</label>
              <input id="support-email" className="input" defaultValue="support@brainup.io" />
            </div>
            <div>
              <label htmlFor="lang" className="label">Default language</label>
              <select id="lang" className="input"><option>English</option><option>Spanish</option><option>French</option></select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Shield size={18} /></span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">Security</h3>
              <p className="text-xs text-gray-400">Access and authentication</p>
            </div>
          </div>
          <ul className="mt-5 space-y-4">
            {[
              { label: 'Require email confirmation', desc: 'New users must verify their email address.' },
              { label: 'Enforce strong passwords', desc: 'Minimum 8 characters with mixed case and a number.' },
              { label: 'Two-factor authentication', desc: 'Optional TOTP-based 2FA for all accounts.' },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{row.desc}</p>
                </div>
                <Toggle defaultOn={row.label !== 'Two-factor authentication'} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Bell size={18} /></span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">Notifications</h3>
              <p className="text-xs text-gray-400">Email digests and alerts</p>
            </div>
          </div>
          <ul className="mt-5 space-y-4">
            {[
              { label: 'Weekly activity digest', desc: 'Summary of platform activity every Monday.' },
              { label: 'New user sign-ups', desc: 'Get notified when an account is created.' },
              { label: 'Course publication alerts', desc: 'Alerts when a teacher publishes a course.' },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{row.desc}</p>
                </div>
                <Toggle defaultOn />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Palette size={18} /></span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">Appearance</h3>
              <p className="text-xs text-gray-400">Branding and theme</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div>
              <label className="label">Accent color</label>
              <div className="flex gap-3">
                {['#5B5FEF', '#22C55E', '#F59E0B', '#EF4444', '#0EA5E9'].map((c, i) => (
                  <button key={c} className={`h-9 w-9 rounded-xl transition-transform hover:scale-110 ${i === 0 ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`} style={{ backgroundColor: c }} aria-label={`Accent ${c}`} />
                ))}
              </div>
            </div>
            <div>
              <label className="label">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['Light', 'Dark', 'System'].map((t) => (
                  <button key={t} className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${t === 'Light' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
