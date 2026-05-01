import { Link } from 'react-router-dom';
import type { Shop } from '../types';
import { similarShops } from '../lib/derive';
import { ShopImage } from './ShopImage';

export function SimilarShops({ shop }: { shop: Shop }) {
  const items = similarShops(shop, 4);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 pt-6 mt-6">
      <h2 className="text-lg font-semibold mb-1">品揃えが近いショップ</h2>
      <p className="text-xs text-neutral-500 mb-4">
        {shop.name} と取扱ブランドの重なりが大きい店
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(({ shop: s, score, common }) => (
          <li key={s.id}>
            <Link
              to={`/shop/${s.id}`}
              className="flex gap-3 items-start p-2 border border-neutral-200 rounded-lg bg-white hover:border-neutral-900 active:bg-neutral-50"
            >
              <div className="w-20 h-20 shrink-0 rounded overflow-hidden bg-neutral-100">
                <ShopImage src={s.image_paths?.[0]} alt={s.name} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-2">
                  <span>{s.area}</span>
                  <span className="font-mono text-neutral-400">類似度 {(score * 100).toFixed(0)}%</span>
                </div>
                <div className="font-semibold text-sm leading-tight mb-1.5 truncate">{s.name}</div>
                <div className="text-[11px] text-neutral-600">
                  共通: {common.slice(0, 4).join(' / ')}
                  {common.length > 4 && ` +${common.length - 4}`}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
