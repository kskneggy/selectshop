import type { FilterState } from '../lib/filter';
import {
  allAreas,
  allAudienceTags,
  allGenres,
  audienceTagLabel,
  genderLabel,
  genreLabel,
  priceLabel,
} from '../lib/derive';
import type { AudienceTag, Gender, Genre, PriceRange } from '../types';
import { clsx } from 'clsx';

const genders: Gender[] = ['mens', 'womens', 'unisex'];
const prices: PriceRange[] = ['low', 'mid', 'high', 'luxury'];

type Props = {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  resultCount: number;
};

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-2.5 py-1 text-xs rounded-full border transition-colors',
        active
          ? 'bg-neutral-900 text-white border-neutral-900'
          : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
      )}
    >
      {children}
    </button>
  );
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterBar({ filter, setFilter, resultCount }: Props) {
  return (
    <div className="space-y-4 mb-6">
      <input
        type="search"
        value={filter.query}
        onChange={(e) => setFilter({ ...filter, query: e.target.value })}
        placeholder="店名・ブランド・特徴で検索（例: AURALEE / 中目黒 / ヴィンテージ）"
        className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-neutral-900"
      />

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div>
          <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">エリア</div>
          <div className="flex flex-wrap gap-1.5">
            {allAreas.map((a) => (
              <Chip
                key={a}
                active={filter.areas.includes(a)}
                onClick={() => setFilter({ ...filter, areas: toggle(filter.areas, a) })}
              >
                {a}
              </Chip>
            ))}
          </div>
        </div>

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
          <div className="text-[11px] text-neutral-500 mb-1.5 uppercase tracking-wide">価格</div>
          <div className="flex flex-wrap gap-1.5">
            {prices.map((p) => (
              <Chip
                key={p}
                active={filter.prices.includes(p)}
                onClick={() => setFilter({ ...filter, prices: toggle(filter.prices, p) })}
              >
                <span className="font-mono">{priceLabel[p]}</span>
              </Chip>
            ))}
          </div>
        </div>
      </div>

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

      {(filter.brand || filter.areas.length || filter.genders.length || filter.prices.length || filter.audiences.length || filter.genres.length || filter.query) && (
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          {filter.brand && (
            <span className="bg-neutral-900 text-white px-2 py-0.5 rounded-full">
              brand: {filter.brand}
              <button
                onClick={() => setFilter({ ...filter, brand: null })}
                className="ml-2"
                aria-label="clear"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => setFilter({ query: '', areas: [], genders: [], prices: [], audiences: [], genres: [], brand: null })}
            className="text-neutral-500 hover:text-neutral-900 underline"
          >
            すべてクリア
          </button>
          <span className="ml-auto">{resultCount} 店</span>
        </div>
      )}
    </div>
  );
}
