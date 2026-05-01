import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  allShops,
  audienceTagLabel,
  brandInitials,
  brandsFromShops,
  type BrandRow,
} from '../lib/derive';
import { applyFilter, emptyFilter } from '../lib/filter';
import { FilterBar } from '../components/FilterBar';
import { ShopImage } from '../components/ShopImage';

type Sort = 'popular' | 'alpha' | 'kana';

function getInitial(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  if (/^[A-Z]$/.test(ch)) return ch;
  return '#';
}

export function BrandsIndex() {
  const [filter, setFilter] = useState({ ...emptyFilter });
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('popular');
  const [initial, setInitial] = useState<string | null>(null);

  const filteredShops = useMemo(() => applyFilter(allShops, filter), [filter]);
  const brandsForCurrent = useMemo(() => brandsFromShops(filteredShops), [filteredShops]);

  const filteredBrands = useMemo(() => {
    const query = q.trim().toLowerCase();
    let rows = brandsForCurrent.filter((b) => {
      if (query) {
        const hay = [b.name, b.kana ?? ''].join(' ').toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (initial && b.initial !== initial) return false;
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
      if (sort === 'kana') {
        const aHas = a.kana ? 0 : 1;
        const bHas = b.kana ? 0 : 1;
        if (aHas !== bHas) return aHas - bHas;
        const aKey = a.kana ?? a.name;
        const bKey = b.kana ?? b.name;
        return aKey.localeCompare(bKey, 'ja');
      }
      return b.shopCount - a.shopCount || a.name.localeCompare(b.name);
    });
    return rows;
  }, [brandsForCurrent, q, sort, initial]);

  const grouped = useMemo(() => {
    if (sort !== 'alpha') return null;
    const groups = new Map<string, typeof filteredBrands>();
    for (const b of filteredBrands) {
      if (!groups.has(b.initial)) groups.set(b.initial, []);
      groups.get(b.initial)!.push(b);
    }
    return Array.from(groups.entries());
  }, [sort, filteredBrands]);

  const initialsForCurrent = useMemo(() => {
    return Array.from(new Set(filteredBrands.map((b) => b.initial))).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });
  }, [filteredBrands]);

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          ブランド <span className="text-neutral-400 text-base font-normal">({brandsForCurrent.length})</span>
        </h1>
        <p className="text-sm text-neutral-500">
          ブランドをタップで「そのブランドを扱う店」一覧へ。フィルタはショップタブと同じ条件が使えます。
        </p>
      </header>

      <FilterBar filter={filter} setFilter={setFilter} resultCount={brandsForCurrent.length} showSort={false} />

      <div className="space-y-3 mb-5">
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ブランド名・カナで検索（例: オーラリー）"
          className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-neutral-900"
        />

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 mr-1">並び順</span>
          {(
            [
              { key: 'popular', label: '取扱店多い順' },
              { key: 'alpha', label: 'A-Z' },
              { key: 'kana', label: 'カナ順' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={clsx(
                'px-3 py-1.5 rounded-full border min-h-[36px]',
                sort === key
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {sort === 'alpha' && initialsForCurrent.length > 0 && (
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
              {initialsForCurrent.map((c) => (
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
      </div>

      <div className="text-xs text-neutral-500 mb-3">
        {filteredBrands.length} ブランドを表示
      </div>

      {filteredBrands.length === 0 ? (
        <div className="border border-dashed border-neutral-300 rounded-lg py-16 text-center text-neutral-500">
          条件に合うブランドがありません
        </div>
      ) : grouped ? (
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
          {filteredBrands.map((b) => (
            <BrandCard key={b.name} brand={b} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BrandCard({ brand }: { brand: BrandRow }) {
  return (
    <li>
      <Link
        to={`/brand/${encodeURIComponent(brand.name)}`}
        className="block px-3 py-3 border border-neutral-200 rounded-lg bg-white hover:border-neutral-900 active:bg-neutral-50"
      >
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className="text-[15px] font-semibold tracking-tight truncate">{brand.name}</span>
          <span className="text-xs text-neutral-500 font-mono shrink-0">
            {brand.shopCount} 店
          </span>
        </div>
        {brand.kana && (
          <div className="text-[11px] text-neutral-400 mb-1.5 truncate">{brand.kana}</div>
        )}
        {brand.previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[0, 1, 2].map((i) => {
              const src = brand.previewImages[i];
              return (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded bg-neutral-100"
                >
                  {src ? (
                    <ShopImage src={src} alt={`${brand.name} 取扱店`} className="w-full h-full" />
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
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

// referenced to avoid unused
void getInitial;
void brandInitials;
