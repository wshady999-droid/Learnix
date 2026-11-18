import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function Logo({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/login')}
      className="flex items-center gap-2.5 focus:outline-none"
      aria-label="BrainUp home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary text-white shadow-md shadow-primary-600/30">
        <Brain size={20} />
      </span>
      <span className={`font-display text-lg font-bold ${dark ? 'text-white' : 'text-ink'}`}>
        Brain<span className="text-primary-500">Up</span>
      </span>
    </button>
  );
}
