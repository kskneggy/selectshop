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

const priceLabel: Record<PriceRange, string> = {
  low: '〜¥1万',
  mid: '¥1〜3万',
  high: '¥3〜10万',
  luxury: '¥10万〜',
};

const priceLongLabel: Record<PriceRange, string> = {
  low: 'カジュアル',
  mid: 'ミドル',
  high: 'ハイ',
  luxury: 'ラグジュアリー',
};

export function PriceLegend() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-3 mb-2">
      <div className="text-[11px] text-neutral-500 mb-2 uppercase tracking-wide">
        ピンの色 = 価格帯（代表的なシャツ・ブラウスの中央値）
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['low', 'mid', 'high', 'luxury'] as PriceRange[]).map((p) => (
          <div key={p} className="flex items-center gap-2">
            <svg
              width="20"
              height="28"
              viewBox="0 0 32 44"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M16 0C7.16 0 0 7.16 0 16c0 12 16 28 16 28s16-16 16-28C32 7.16 24.84 0 16 0z"
                fill={priceColor[p]}
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>
            <div className="leading-tight">
              <div className="text-xs font-medium">{priceLongLabel[p]}</div>
              <div className="text-[10px] text-neutral-500 font-mono">{priceLabel[p]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
