interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">{icon}</span>}
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-gray-500">{message}</p>
      {action}
    </div>
  );
}
