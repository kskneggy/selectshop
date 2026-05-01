import { Link } from 'react-router-dom';
import type { Shop } from '../types';
import { genderLabel, priceLabel, audienceTagLabel } from '../lib/derive';

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      to={`/shop/${shop.id}`}
      className="block border border-neutral-200 rounded-lg p-5 bg-white hover:border-neutral-900 transition-colors"
    >
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-lg font-semibold tracking-tight">{shop.name}</h3>
        <span className="text-xs text-neutral-500 shrink-0">{shop.area}</span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-neutral-600 mb-3">
        <span>{genderLabel[shop.target_gender]}</span>
        <span>·</span>
        <span className="font-mono">{priceLabel[shop.price_range]}</span>
        <span>·</span>
        <span>{shop.audience_tags.slice(0, 3).map((t) => audienceTagLabel[t] ?? t).join(' / ')}</span>
      </div>
      <p className="text-sm text-neutral-700 line-clamp-2 mb-3">{shop.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {shop.brands.slice(0, 6).map((b) => (
          <span
            key={b}
            className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
          >
            {b}
          </span>
        ))}
        {shop.brands.length > 6 && (
          <span className="text-[11px] text-neutral-400 px-1">+{shop.brands.length - 6}</span>
        )}
      </div>
    </Link>
  );
}
