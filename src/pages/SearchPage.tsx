import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allShops } from '../lib/derive';
import { FilterBar } from '../components/FilterBar';
import { ShopCard } from '../components/ShopCard';
import { applyFilter, emptyFilter } from '../lib/filter';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const [filter, setFilter] = useState({ ...emptyFilter, brand: initialBrand });

  const setFilterAndUrl = (next: typeof filter) => {
    setFilter(next);
    if (next.brand) {
      setSearchParams({ brand: next.brand });
    } else {
      setSearchParams({});
    }
  };

  const filtered = useMemo(() => applyFilter(allShops, filter), [filter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          首都圏のセレクトショップ {allShops.length} 店
        </h1>
        <p className="text-sm text-neutral-500">
          ブランド・エリア・テイスト・価格帯で横断検索。プロ向け。
        </p>
      </div>
      <FilterBar filter={filter} setFilter={setFilterAndUrl} resultCount={filtered.length} />
      {filtered.length === 0 ? (
        <div className="border border-dashed border-neutral-300 rounded-lg py-16 text-center text-neutral-500">
          条件に合うショップがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
