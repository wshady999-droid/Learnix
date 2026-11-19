import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from '@/types';

const KEY = 'learnix-session';

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

interface SessionValue {
  session: Session | null;
  signIn: (next: Session) => void;
  signOut: () => void;
  updateSession: (patch: Partial<Pick<Session, 'name' | 'email'>>) => void;
}

const SessionContext = createContext<SessionValue | null>(null);

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.userId || !parsed.role || !parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession);

  const value = useMemo<SessionValue>(() => ({
    session,
    signIn: (next) => {
      sessionStorage.setItem(KEY, JSON.stringify(next));
      setSession(next);
    },
    signOut: () => {
      sessionStorage.removeItem(KEY);
      setSession(null);
    },
    updateSession: (patch) => {
      setSession((current) => {
        if (!current) return current;
        const next = { ...current, ...patch };
        sessionStorage.setItem(KEY, JSON.stringify(next));
        return next;
      });
    },
  }), [session]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
