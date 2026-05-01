import { Link } from 'react-router-dom';
import type { Shop } from '../types';
import { genderLabel, priceLabel, audienceTagLabel } from '../lib/derive';
import { ShopImage } from './ShopImage';

export function ShopCard({ shop }: { shop: Shop }) {
  const hero = shop.image_paths?.[0];
  return (
    <Link
      to={`/shop/${shop.id}`}
      className="block border border-neutral-200 rounded-lg overflow-hidden bg-white hover:border-neutral-900 active:bg-neutral-50 transition-colors"
    >
      <div className="aspect-[16/10] bg-neutral-100 relative">
        <ShopImage src={hero} alt={`${shop.name} の店舗写真`} className="w-full h-full" />
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
          <span className="bg-white/90 backdrop-blur text-[11px] font-medium px-2 py-0.5 rounded-full">
            {shop.area}
          </span>
          {shop.rating !== undefined && (
            <span className="bg-white/90 backdrop-blur text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="text-amber-500">★</span>
              {shop.rating.toFixed(1)}
              {shop.user_rating_count !== undefined && (
                <span className="text-neutral-500">({shop.user_rating_count})</span>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight leading-tight mb-1">
          {shop.name}
        </h3>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center text-xs text-neutral-600 mb-2">
          <span>{genderLabel[shop.target_gender]}</span>
          <span className="text-neutral-300">·</span>
          <span className="font-mono">{priceLabel[shop.price_range]}</span>
          <span className="text-neutral-300">·</span>
          <span className="truncate">
            {shop.audience_tags.slice(0, 3).map((t) => audienceTagLabel[t] ?? t).join(' / ')}
          </span>
        </div>
        <p className="text-[13px] text-neutral-700 line-clamp-2 mb-3 leading-relaxed">
          {shop.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {shop.brands.slice(0, 5).map((b) => (
            <span
              key={b}
              className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
            >
              {b}
            </span>
          ))}
          {shop.brands.length > 5 && (
            <span className="text-[11px] text-neutral-400 px-1">+{shop.brands.length - 5}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
