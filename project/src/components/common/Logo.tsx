import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function Logo({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/login')}
      className="flex items-center gap-2.5 focus:outline-none"
      aria-label="LearnIx home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-primary-glow">
        <GraduationCap size={20} />
      </span>
      <span className={`font-display text-lg font-bold ${dark ? 'text-white' : 'text-ink'}`}>
        Learn<span className="text-primary">Ix</span>
      </span>
    </button>
  );
}
