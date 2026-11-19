import { GraduationCap } from 'lucide-react';

export function Logo({ tone = 'theme' }: { tone?: 'theme' | 'light' }) {
  const text = tone === 'light' ? 'text-white' : 'text-ink';
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
        <GraduationCap size={18} />
      </span>
      <span className={`font-display text-lg font-bold ${text}`}>
        Learn<span className="text-primary">Ix</span>
      </span>
    </span>
  );
}
