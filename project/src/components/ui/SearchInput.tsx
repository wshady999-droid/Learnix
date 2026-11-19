import type { ReactNode } from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function SearchInput({ placeholder = 'Search...', onChange }: SearchInputProps) {
  const [value, setValue] = useState('');
  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        className="input pl-10"
      />
    </div>
  );
}
