import { useState } from 'react';
import type { FilterState } from '../lib/filter';
import { sortDescription, sortLabel } from '../lib/filter';
import {
  allAreas,
  allAudienceTags,
  allGenres,
  areaCount,
  audienceTagLabel,
  genderLabel,
  genreLabel,
  priceLabel,
} from '../lib/derive';
import type { AudienceTag, Gender, Genre, PriceRange } from '../types';
import { clsx } from 'clsx';

const genders: Gender[] = ['mens', 'womens', 'unisex'];
const prices: PriceRange[] = ['low', 'mid', 'high', 'luxury'];
const sortKeys: FilterState['sort'][] = ['popular', 'rating', 'brands', 'price_asc', 'price_desc', 'alpha', 'area'];

type Props = {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  resultCount: number;
  showSort?: boolean;
};

function Chip({
  active,
  children,
  onClick,
  badge,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-3 py-1.5 text-xs rounded-full border transition-colors min-h-[36px] inline-flex items-center gap-1',
        active
          ? 'bg-neutral-900 text-white border-neutral-900'
          : 'bg-white text-neutral-700 border-neutral-300 active:bg-neutral-50'
      )}
    >
      {children}
      {badge !== undefined && (
        <span className={clsx('text-[10px] font-mono', active ? 'opacity-75' : 'text-neutral-400')}>
          {badge}
        </span>
      )}
    </button>
  );
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterBar({ filter, setFilter, resultCount, showSort = true }: Props) {
  const [open, setOpen] = useState(false);
  const advancedActive = filter.audiences.length + filter.genres.length;
  const anyActive =
    !!filter.brand ||
    filter.areas.length +
      filter.genders.length +
      filter.prices.length +
      filter.audiences.length +
      filter.genres.length +
      (filter.query ? 1 : 0) >
      0;

  return (
    <div className="space-y-3 mb-5">
      <input
        type="search"
        inputMode="search"
        autoComplete="off"
        value={filter.query}
        onChange={(e) => setFilter({ ...filter, query: e.target.value })}
        placeholder="店名・ブランド・特徴で検索"
        className="w-full px-4 py-3 text-base border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-neutral-900"
      />

      <div>
        <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">エリア</div>
        <div className="flex flex-wrap gap-1.5">
          {allAreas.map((a) => (
            <Chip
              key={a}
              active={filter.areas.includes(a)}
              onClick={() => setFilter({ ...filter, areas: toggle(filter.areas, a) })}
              badge={areaCount[a]}
            >
              {a}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">性別</div>
          <div className="flex flex-wrap gap-1.5">
            {genders.map((g) => (
              <Chip
                key={g}
                active={filter.genders.includes(g)}
                onClick={() => setFilter({ ...filter, genders: toggle(filter.genders, g) })}
              >
                {genderLabel[g]}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">価格帯</div>
          <div className="flex flex-wrap gap-1.5">
            {prices.map((p) => (
              <Chip
                key={p}
                active={filter.prices.includes(p)}
                onClick={() => setFilter({ ...filter, prices: toggle(filter.prices, p) })}
              >
                <span className="font-mono text-[11px]">{priceLabel[p]}</span>
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-neutral-600 underline underline-offset-2 hover:text-neutral-900 min-h-[36px]"
        >
          {open ? '詳細を閉じる' : `詳細（テイスト・ジャンル）${advancedActive ? ` · ${advancedActive}` : ''}`}
        </button>
      </div>

      {open && (
        <div className="space-y-3 pt-1">
          <div>
            <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">テイスト</div>
            <div className="flex flex-wrap gap-1.5">
              {allAudienceTags.map((t) => (
                <Chip
                  key={t}
                  active={filter.audiences.includes(t)}
                  onClick={() => setFilter({ ...filter, audiences: toggle(filter.audiences, t as AudienceTag) })}
                >
                  {audienceTagLabel[t]}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">ジャンル</div>
            <div className="flex flex-wrap gap-1.5">
              {allGenres.map((g) => (
                <Chip
                  key={g}
                  active={filter.genres.includes(g)}
                  onClick={() => setFilter({ ...filter, genres: toggle(filter.genres, g as Genre) })}
                >
                  {genreLabel[g]}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSort && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">並び順:</span>
            <select
              value={filter.sort}
              onChange={(e) => setFilter({ ...filter, sort: e.target.value as FilterState['sort'] })}
              className="px-2 py-1.5 border border-neutral-300 rounded bg-white min-h-[36px] text-xs"
            >
              {sortKeys.map((k) => (
                <option key={k} value={k}>
                  {sortLabel[k]}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[11px] text-neutral-400 pl-12">
            {sortDescription[filter.sort]}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs">
        <span className="text-neutral-500">{resultCount} 店</span>
        {filter.brand && (
          <span className="bg-neutral-900 text-white px-2 py-1 rounded-full">
            brand: {filter.brand}
            <button
              onClick={() => setFilter({ ...filter, brand: null })}
              className="ml-2"
              aria-label="clear brand"
            >
              ×
            </button>
          </span>
        )}
        {anyActive && (
          <button
            onClick={() => setFilter({ ...emptyFilterDefault, sort: filter.sort })}
            className="ml-auto text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
          >
            すべてクリア
          </button>
        )}
      </div>
    </div>
  );
}

const emptyFilterDefault: FilterState = {
  query: '',
  areas: [],
  genders: [],
  prices: [],
  audiences: [],
  genres: [],
  brand: null,
  sort: 'popular',
};
