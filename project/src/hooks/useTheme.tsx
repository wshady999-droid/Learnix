import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('learnix-theme');
  return stored === 'dark' || stored === 'light' ? stored : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('learnix-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export const chartTheme = {
  grid: 'var(--chart-grid)',
  axis: 'var(--chart-axis)',
  primary: '#E50914',
  secondary: '#FF3038',
  success: '#22C55E',
  warning: '#F59E0B',
  tooltip: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text)',
  },
};
