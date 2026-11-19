import type { ReactNode } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, rowKey, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center py-16">
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b bg-soft">
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-muted ${col.className ?? ''}`}>
                  <span className="flex items-center gap-1">{col.header}<ArrowUpDown size={11} className="opacity-50" /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={rowKey(row)} className="border-b transition-colors last:border-b-0 hover:bg-primary-soft/40" style={{ borderColor: 'var(--border)' }}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 ${col.className ?? ''}`}>{col.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
