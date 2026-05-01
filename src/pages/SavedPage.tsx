import { Link } from 'react-router-dom';
import { useSavedShops } from '../components/SavedList';
import { allShops } from '../lib/derive';
import { ShopCard } from '../components/ShopCard';

export function SavedPage() {
  const { items, clear } = useSavedShops();
  const shops = allShops.filter((s) => items.includes(s.id));

  return (
    <div>
      <header className="mb-5 flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            保存リスト <span className="text-neutral-400 text-base font-normal">({shops.length})</span>
          </h1>
          <p className="text-sm text-neutral-500">気になるショップをまとめておく場所。<br className="sm:hidden" />お使いの端末（ブラウザ）に保存されます。</p>
        </div>
        {shops.length > 0 && (
          <button
            onClick={() => {
              if (confirm('保存リストをすべて削除しますか？')) clear();
            }}
            className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
          >
            すべて削除
          </button>
        )}
      </header>

      {shops.length === 0 ? (
        <div className="border border-dashed border-neutral-300 rounded-lg py-16 text-center text-neutral-500">
          <p className="mb-3">保存されたショップはまだありません</p>
          <Link to="/" className="text-sm underline underline-offset-2 hover:text-neutral-900">
            ショップ一覧から追加 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shops.map((s) => (
            <ShopCard key={s.id} shop={s} />
          ))}
        </div>
      )}
    </div>
  );
}
