import { Link, useParams } from 'react-router-dom';
import { getShopsByBrand } from '../lib/derive';
import { ShopCard } from '../components/ShopCard';

export function BrandDetail() {
  const { name } = useParams();
  const brandName = name ? decodeURIComponent(name) : '';
  const shops = getShopsByBrand(brandName);

  if (!brandName || shops.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500 mb-4">「{brandName}」を扱うショップが見つかりません</p>
        <Link to="/" className="text-sm underline">一覧に戻る</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900">← 一覧へ</Link>
      <header className="mt-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="text-sm text-neutral-500 mb-1">ブランド横断検索</div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight break-words">{brandName}</h1>
        <p className="text-sm text-neutral-500 mt-2">
          このブランドを扱う {shops.length} 店
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map((s) => (
          <ShopCard key={s.id} shop={s} />
        ))}
      </div>
    </div>
  );
}
