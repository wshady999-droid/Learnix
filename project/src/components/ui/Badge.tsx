import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

const variants = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  neutral: 'bg-soft text-muted',
};

export function Badge({ children, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {children}
    </span>
  );
}
