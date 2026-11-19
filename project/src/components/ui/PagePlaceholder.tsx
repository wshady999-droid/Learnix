import { useLocation, NavLink } from 'react-router-dom';
import { Link2 } from 'lucide-react';

export function PagePlaceholder({ label }: { label?: string }) {
  const { pathname } = useLocation();
  const name = label ?? pathname.split('/').pop() ?? '';
  return (
    <div className="animate-fade-in">
      <div className="card flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Link2 size={28} />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold capitalize text-ink">{name.replace(/-/g, ' ')}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            This page is part of the LearnIx roadmap and will be built in the next development phase, once the backend services are connected.
          </p>
        </div>
        <NavLink to="/login" className="btn-primary">Back to sign in</NavLink>
      </div>
    </div>
  );
}
