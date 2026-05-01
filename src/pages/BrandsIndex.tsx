import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  allAreas,
  allBrands,
  audienceTagLabel,
  brandInitials,
} from '../lib/derive';

type Sort = 'popular' | 'alpha';

export function BrandsIndex() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('popular');
  const [initial, setInitial] = useState<string | null>(null);
  const [areaFilter, setAreaFilter] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let rows = allBrands.filter((b) => {
      if (query && !b.name.toLowerCase().includes(query)) return false;
      if (initial && b.initial !== initial) return false;
      if (areaFilter.length && !areaFilter.some((a) => b.areas.includes(a))) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sort === 'alpha') {
        if (a.initial !== b.initial) {
          if (a.initial === '#') return 1;
          if (b.initial === '#') return -1;
          return a.initial.localeCompare(b.initial);
        }
        return a.name.localeCompare(b.name);
      }
      return b.shopCount - a.shopCount || a.name.localeCompare(b.name);
    });
    return rows;
  }, [q, sort, initial, areaFilter]);

  const grouped = useMemo(() => {
    if (sort !== 'alpha') return null;
    const groups = new Map<string, typeof filtered>();
    for (const b of filtered) {
      if (!groups.has(b.initial)) groups.set(b.initial, []);
      groups.get(b.initial)!.push(b);
    }
    return Array.from(groups.entries());
  }, [sort, filtered]);

  const toggleArea = (a: string) =>
    setAreaFilter((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          ブランド <span className="text-neutral-400 text-base font-normal">({allBrands.length})</span>
        </h1>
        <p className="text-sm text-neutral-500">タップで「そのブランドを扱う店」一覧へ。</p>
      </header>

      <div className="space-y-3 mb-5">
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ブランド名で検索"
          className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-neutral-900"
        />

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 mr-1">並び順</span>
          <button
            onClick={() => setSort('popular')}
            className={clsx(
              'px-3 py-1.5 rounded-full border min-h-[36px]',
              sort === 'popular'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300'
            )}
          >
            人気順
          </button>
          <button
            onClick={() => setSort('alpha')}
            className={clsx(
              'px-3 py-1.5 rounded-full border min-h-[36px]',
              sort === 'alpha'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300'
            )}
          >
            A-Z
          </button>
        </div>

        {sort === 'alpha' && (
          <div className="-mx-4 px-4 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              <button
                onClick={() => setInitial(null)}
                className={clsx(
                  'min-w-[34px] h-9 text-xs font-mono rounded border',
                  initial === null
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200'
                )}
              >
                ALL
              </button>
              {brandInitials.map((c) => (
                <button
                  key={c}
                  onClick={() => setInitial(c === initial ? null : c)}
                  className={clsx(
                    'min-w-[34px] h-9 text-xs font-mono rounded border',
                    initial === c
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">エリアで絞り込み</div>
          <div className="flex flex-wrap gap-1.5">
            {allAreas.map((a) => (
              <button
                key={a}
                onClick={() => toggleArea(a)}
                className={clsx(
                  'px-2.5 py-1 text-xs rounded-full border min-h-[32px]',
                  areaFilter.includes(a)
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-300'
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-neutral-500 mb-3">
        {filtered.length} / {allBrands.length} ブランド
      </div>

      {grouped ? (
        <div className="space-y-6">
          {grouped.map(([letter, rows]) => (
            <section key={letter}>
              <h2 className="sticky top-[57px] z-[1] bg-neutral-50 -mx-4 px-4 py-1.5 text-xs font-mono text-neutral-500 border-b border-neutral-200">
                {letter}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {rows.map((b) => (
                  <BrandCard key={b.name} brand={b} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((b) => (
            <BrandCard key={b.name} brand={b} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BrandCard({ brand }: { brand: typeof allBrands[number] }) {
  return (
    <li>
      <Link
        to={`/brand/${encodeURIComponent(brand.name)}`}
        className="block px-4 py-3 border border-neutral-200 rounded-lg bg-white hover:border-neutral-900 active:bg-neutral-50"
      >
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-base font-medium truncate">{brand.name}</span>
          <span className="text-xs text-neutral-500 font-mono shrink-0">
            {brand.shopCount} 店
          </span>
        </div>
        <div className="text-[11px] text-neutral-500 truncate">
          {brand.areas.slice(0, 4).join(' · ')}
          {brand.areas.length > 4 && ` +${brand.areas.length - 4}`}
        </div>
        {brand.topAudienceTags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {brand.topAudienceTags.map((t) => (
              <span key={t} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                {audienceTagLabel[t] ?? t}
              </span>
            ))}
          </div>
        )}
      </Link>
    </li>
  );
}
