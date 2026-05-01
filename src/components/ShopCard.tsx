import { Link } from 'react-router-dom';
import type { Shop } from '../types';
import { genderLabel, priceLabel, audienceTagLabel } from '../lib/derive';

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      to={`/shop/${shop.id}`}
      className="block border border-neutral-200 rounded-lg p-4 sm:p-5 bg-white hover:border-neutral-900 active:bg-neutral-50 transition-colors"
    >
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight leading-tight">
          {shop.name}
        </h3>
        <span className="text-xs text-neutral-500 shrink-0">{shop.area}</span>
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center text-xs text-neutral-600 mb-2.5">
        <span>{genderLabel[shop.target_gender]}</span>
        <span className="text-neutral-300">·</span>
        <span className="font-mono">{priceLabel[shop.price_range]}</span>
        <span className="text-neutral-300">·</span>
        <span>
          {shop.audience_tags.slice(0, 3).map((t) => audienceTagLabel[t] ?? t).join(' / ')}
        </span>
      </div>
      <p className="text-[13px] sm:text-sm text-neutral-700 line-clamp-2 mb-3 leading-relaxed">
        {shop.description}
      </p>
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
