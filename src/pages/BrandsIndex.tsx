import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allBrands } from '../lib/derive';

export function BrandsIndex() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return allBrands;
    return allBrands.filter((b) => b.name.toLowerCase().includes(query));
  }, [q]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">ブランド一覧 <span className="text-neutral-400 text-base font-normal">({allBrands.length})</span></h1>
        <p className="text-sm text-neutral-500">クリックで「そのブランドを扱う店」一覧へ。</p>
      </header>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ブランド名で検索"
        className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-neutral-900 mb-5"
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filtered.map((b) => (
          <li key={b.name}>
            <Link
              to={`/brand/${encodeURIComponent(b.name)}`}
              className="flex items-baseline justify-between gap-2 px-3 py-2 border border-neutral-200 rounded bg-white hover:border-neutral-900"
            >
              <span className="text-sm truncate">{b.name}</span>
              <span className="text-xs text-neutral-400 shrink-0 font-mono">{b.shopCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
