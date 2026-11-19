import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  sortValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, rowKey, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);

  const rows = useMemo(() => {
    if (!sort) return data;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return data;
    const valueOf = column.sortValue;
    return [...data].sort((a, b) => {
      const left = valueOf(a);
      const right = valueOf(b);
      const compared = typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right));
      return sort.dir === 'asc' ? compared : -compared;
    });
  }, [columns, data, sort]);

  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center px-6 py-16">
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  const toggle = (key: string) => {
    setSort((current) => {
      if (current?.key !== key) return { key, dir: 'asc' };
      return { key, dir: current.dir === 'asc' ? 'desc' : 'asc' };
    });
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b bg-soft" style={{ borderColor: 'var(--border)' }}>
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${column.className ?? ''}`}>
                  {column.sortValue ? (
                    <button type="button" onClick={() => toggle(column.key)} className="inline-flex items-center gap-1 hover:text-ink">
                      {column.header}
                      {sort?.key === column.key
                        ? (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)
                        : <ArrowUpDown size={12} className="opacity-40" />}
                    </button>
                  ) : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b last:border-b-0 hover:bg-soft" style={{ borderColor: 'var(--border)' }}>
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3.5 align-middle ${column.className ?? ''}`}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
