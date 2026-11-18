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
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500 ${col.className ?? ''}`}>
                  <span className="flex items-center gap-1">{col.header}<ArrowUpDown size={11} className="text-gray-300" /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-primary-50/30">
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
