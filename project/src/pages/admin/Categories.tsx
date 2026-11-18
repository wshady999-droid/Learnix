import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
import { categories } from '@/services/mockData';

export default function Categories() {
  const [name, setName] = useState('');

  return (
    <>
      <PageHeader title="Categories" subtitle="Organize courses into browsable topic areas." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5">
            <SearchInput placeholder="Search categories..." />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.id} className="card group p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundColor: c.color }}>
                    <Layers size={20} />
                  </span>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="btn-ghost p-2"><Pencil size={14} /></button>
                    <button className="btn-ghost p-2 text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="mt-3.5 font-display text-base font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{c.description}</p>
                <div className="mt-4"><Badge variant="primary">{c.courseCount} courses</Badge></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card h-fit p-6">
          <h3 className="font-display text-base font-semibold text-ink">Add category</h3>
          <p className="mt-1 text-sm text-gray-500">Create a new topic area for courses.</p>
          <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); setName(''); }}>
            <div>
              <label htmlFor="cat-name" className="label">Category name</label>
              <input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="e.g. Artificial Intelligence" />
            </div>
            <div>
              <label htmlFor="cat-desc" className="label">Description</label>
              <textarea id="cat-desc" rows={3} className="input resize-none" placeholder="What is this category about?" />
            </div>
            <div>
              <label htmlFor="cat-color" className="label">Color</label>
              <select id="cat-color" className="input">
                <option>Primary — Indigo</option>
                <option>Success — Green</option>
                <option>Warning — Amber</option>
                <option>Danger — Red</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full"><Plus size={16} /> Create category</button>
          </form>
        </div>
      </div>
    </>
  );
}
