import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Save, Shield, Bell, Globe, type LucideIcon } from 'lucide-react';

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-primary' : 'bg-line'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon size={18} /></span>
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Platform preferences."
        actions={<button className="btn-primary"><Save size={16} /> Save</button>}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section icon={Globe} title="General">
          <div className="space-y-4">
            <div>
              <label htmlFor="site-name" className="label">Platform name</label>
              <input id="site-name" className="input" defaultValue="LearnIx" />
            </div>
            <div>
              <label htmlFor="support-email" className="label">Support email</label>
              <input id="support-email" className="input" defaultValue="support@learnix.io" />
            </div>
          </div>
        </Section>

        <Section icon={Shield} title="Security">
          <ul className="space-y-3">
            {[
              { label: 'Confirm emails', desc: 'Users verify their email at sign-up.' },
              { label: 'Strong passwords', desc: 'At least 8 characters.' },
              { label: 'Two-factor login', desc: 'Extra code on sign-in.' },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 rounded-xl bg-soft p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{row.desc}</p>
                </div>
                <Toggle defaultOn={row.label !== 'Two-factor login'} />
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Bell} title="Notifications">
          <ul className="space-y-3">
            {[
              { label: 'Weekly summary', desc: 'Every Monday.' },
              { label: 'New sign-ups', desc: 'When an account is created.' },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-4 rounded-xl bg-soft p-4">
                <div>
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{row.desc}</p>
                </div>
                <Toggle defaultOn />
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
