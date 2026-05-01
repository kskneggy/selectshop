import { Marker } from '@vis.gl/react-google-maps';
import type { Shop, PriceRange } from '../types';

const priceColor: Record<PriceRange, string> = {
  low: '#9ca3af',
  mid: '#3b82f6',
  high: '#f59e0b',
  luxury: '#ef4444',
};

function priceIcon(price: PriceRange) {
  const color = priceColor[price];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 32 44"><path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28C32 7.16 24.84 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type Props = {
  shops: Shop[];
  onClick: (id: string) => void;
};

export function ClusteredMarkers({ shops, onClick }: Props) {
  return (
    <>
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={shop.coords!}
          icon={priceIcon(shop.price_range)}
          title={shop.name}
          onClick={() => onClick(shop.id)}
        />
      ))}
    </>
  );
}

export function PriceLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600 mt-2">
      <span className="text-neutral-500">価格帯:</span>
      {(['low', 'mid', 'high', 'luxury'] as PriceRange[]).map((p) => (
        <span key={p} className="inline-flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full border border-white shadow"
            style={{ backgroundColor: priceColor[p] }}
          />
          {p === 'low' ? '〜¥1万' : p === 'mid' ? '¥1〜3万' : p === 'high' ? '¥3〜10万' : '¥10万〜'}
        </span>
      ))}
    </div>
  );
}
