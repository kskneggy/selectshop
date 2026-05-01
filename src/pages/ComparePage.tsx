import { Link } from 'react-router-dom';
import { useCompareShops } from '../components/CompareList';
import { allShops, audienceTagLabel, genderLabel, priceLabel } from '../lib/derive';
import { ShopImage } from '../components/ShopImage';
import type { Shop } from '../types';

function intersect(arrays: string[][]): string[] {
  if (arrays.length === 0) return [];
  return arrays.reduce<string[]>((acc, arr, i) => (i === 0 ? arr.slice() : acc.filter((x) => arr.includes(x))), []);
}

function uniqueTo(target: string[], others: string[][]): string[] {
  const merged = new Set(others.flat());
  return target.filter((b) => !merged.has(b));
}

export function ComparePage() {
  const { items, remove, clear } = useCompareShops();
  const shops = items.map((id) => allShops.find((s) => s.id === id)).filter(Boolean) as Shop[];

  if (shops.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">ショップ比較</h1>
        <p className="text-sm text-neutral-500 mb-6">2〜4店を選んで取扱ブランドの重なりと差分を可視化します。</p>
        <div className="border border-dashed border-neutral-300 rounded-lg py-16 text-center text-neutral-500">
          <p className="mb-3">比較するショップが選ばれていません</p>
          <Link to="/" className="text-sm underline underline-offset-2 hover:text-neutral-900">
            ショップ詳細から「比較に追加」 →
          </Link>
        </div>
      </div>
    );
  }

  const brandSets = shops.map((s) => s.brands);
  const common = intersect(brandSets);
  const allBrandsUnion = Array.from(new Set(brandSets.flat())).sort();

  return (
    <div>
      <header className="mb-5 flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            ショップ比較 <span className="text-neutral-400 text-base font-normal">({shops.length}/4)</span>
          </h1>
          <p className="text-sm text-neutral-500">取扱ブランドの重なりと差分。</p>
        </div>
        <button
          onClick={() => {
            if (confirm('比較リストをクリアしますか？')) clear();
          }}
          className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
        >
          リセット
        </button>
      </header>

      <div className={`grid gap-3 mb-6 grid-cols-${Math.min(shops.length, 4)} sm:grid-cols-${Math.min(shops.length, 4)}`}
           style={{ gridTemplateColumns: `repeat(${Math.min(shops.length, 4)}, minmax(0, 1fr))` }}>
        {shops.map((s) => (
          <div key={s.id} className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <div className="aspect-[4/3] bg-neutral-100">
              <ShopImage src={s.image_paths?.[0]} alt={s.name} className="w-full h-full" />
            </div>
            <div className="p-3">
              <div className="text-[11px] text-neutral-500 mb-0.5">{s.area}</div>
              <Link to={`/shop/${s.id}`} className="font-semibold text-sm leading-tight hover:underline block mb-1.5">
                {s.name}
              </Link>
              <div className="text-[11px] text-neutral-600 mb-2">
                {genderLabel[s.target_gender]} · <span className="font-mono">{priceLabel[s.price_range]}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mb-2">
                {s.audience_tags.slice(0, 3).map((t) => audienceTagLabel[t] ?? t).join(' / ')}
              </div>
              <div className="text-[11px] text-neutral-500 mb-2">{s.brands.length} ブランド</div>
              <button
                onClick={() => remove(s.id)}
                className="text-[10px] text-neutral-400 underline hover:text-neutral-900"
              >
                外す
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">
          共通ブランド <span className="text-neutral-400 font-normal text-sm">({common.length})</span>
        </h2>
        {common.length === 0 ? (
          <p className="text-sm text-neutral-500">全店共通のブランドはありません</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {common.map((b) => (
              <Link
                key={b}
                to={`/brand/${encodeURIComponent(b)}`}
                className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-1 rounded"
              >
                {b}
              </Link>
            ))}
          </div>
        )}
      </section>

      {shops.length > 1 && (
        <section className="mb-8 space-y-4">
          <h2 className="text-base font-semibold">各店ユニークブランド</h2>
          {shops.map((s, i) => {
            const others = shops.filter((_, j) => j !== i).map((x) => x.brands);
            const uniq = uniqueTo(s.brands, others);
            return (
              <div key={s.id}>
                <div className="text-sm font-medium mb-1">
                  {s.name}{' '}
                  <span className="text-neutral-400 text-xs font-normal">({uniq.length} 店オリジナル)</span>
                </div>
                {uniq.length === 0 ? (
                  <p className="text-xs text-neutral-500">他店と完全に重なる構成</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {uniq.map((b) => (
                      <Link
                        key={b}
                        to={`/brand/${encodeURIComponent(b)}`}
                        className="text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded"
                      >
                        {b}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      <section>
        <h2 className="text-base font-semibold mb-2">全ブランド × ショップ表</h2>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="text-xs border-collapse min-w-full">
            <thead>
              <tr className="border-b border-neutral-300">
                <th className="text-left py-2 pr-3 sticky left-0 bg-neutral-50 font-medium">ブランド</th>
                {shops.map((s) => (
                  <th key={s.id} className="px-2 py-2 text-center font-medium whitespace-nowrap">
                    {s.name.length > 8 ? `${s.name.slice(0, 8)}…` : s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allBrandsUnion.map((b) => (
                <tr key={b} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-1.5 pr-3 sticky left-0 bg-white">
                    <Link to={`/brand/${encodeURIComponent(b)}`} className="hover:underline">
                      {b}
                    </Link>
                  </td>
                  {shops.map((s) => (
                    <td key={s.id} className="px-2 text-center text-neutral-300">
                      {s.brands.includes(b) ? <span className="text-emerald-600">●</span> : '·'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
