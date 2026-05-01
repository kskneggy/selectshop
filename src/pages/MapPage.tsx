import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { APIProvider, Map, InfoWindow } from '@vis.gl/react-google-maps';

import { allShops, audienceTagLabel, genderLabel, priceLabel } from '../lib/derive';
import { applyFilter, emptyFilter } from '../lib/filter';
import { FilterBar } from '../components/FilterBar';
import { ShopImage } from '../components/ShopImage';
import { ClusteredMarkers, PriceLegend } from '../components/ClusteredMarkers';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const TOKYO_CENTER = { lat: 35.6605, lng: 139.7088 };

export function MapPage() {
  const [filter, setFilter] = useState(emptyFilter);
  const [openId, setOpenId] = useState<string | null>(null);
  const filtered = useMemo(() => applyFilter(allShops, filter), [filter]);
  const withCoords = filtered.filter((s) => s.coords);
  const openShop = openId ? withCoords.find((s) => s.id === openId) : null;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">マップで探す</h1>
        <p className="text-sm text-neutral-500">
          条件を絞り込んで地図で位置関係を把握。ピンをタップで詳細へ。
        </p>
      </div>
      <FilterBar filter={filter} setFilter={setFilter} resultCount={withCoords.length} showSort={false} />

      {!apiKey ? (
        <NoKeyState />
      ) : (
        <>
          <PriceLegend />
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={TOKYO_CENTER}
                defaultZoom={13}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ height: '70vh', width: '100%' }}
              >
                <ClusteredMarkers shops={withCoords} onClick={setOpenId} />
              {openShop && (
                <InfoWindow
                  position={openShop.coords!}
                  onCloseClick={() => setOpenId(null)}
                  pixelOffset={[0, -36]}
                >
                  <div className="min-w-[240px] max-w-[260px]">
                    {openShop.image_paths?.[0] && (
                      <div className="-mx-3 -mt-2 mb-2 overflow-hidden">
                        <ShopImage
                          src={openShop.image_paths[0]}
                          alt={openShop.name}
                          className="w-full aspect-[16/9]"
                        />
                      </div>
                    )}
                    <div className="text-[11px] text-neutral-500 mb-0.5 flex items-center gap-2">
                      <span>{openShop.area}</span>
                      {openShop.rating !== undefined && (
                        <span>
                          <span className="text-amber-500">★</span>
                          {openShop.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-base mb-1.5 leading-tight">{openShop.name}</div>
                    <div className="text-[11px] text-neutral-600 mb-2">
                      {genderLabel[openShop.target_gender]} ·{' '}
                      <span className="font-mono">{priceLabel[openShop.price_range]}</span> ·{' '}
                      {openShop.audience_tags
                        .slice(0, 2)
                        .map((t) => audienceTagLabel[t] ?? t)
                        .join(' / ')}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {openShop.brands.slice(0, 4).map((b) => (
                        <span
                          key={b}
                          className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/shop/${openShop.id}`}
                      className="text-xs underline text-neutral-900"
                    >
                      詳細を見る →
                    </Link>
                  </div>
                </InfoWindow>
              )}
              </Map>
            </APIProvider>
          </div>
        </>
      )}

      {withCoords.length < filtered.length && (
        <p className="text-xs text-neutral-400 mt-2">
          ※ {filtered.length - withCoords.length} 店は座標未登録のため地図に表示されません
        </p>
      )}
    </div>
  );
}

function NoKeyState() {
  return (
    <div className="border border-amber-300 bg-amber-50 rounded-lg p-5 text-sm text-amber-900">
      <div className="font-semibold mb-2">Google Maps APIキー未設定</div>
      <p className="mb-3 text-neutral-700">マップ表示には Google Maps API キーが必要です。</p>
      <ol className="list-decimal list-inside space-y-1.5 text-[13px] text-neutral-700">
        <li>
          <a
            className="underline"
            href="https://console.cloud.google.com/google/maps-apis/start"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cloud Console
          </a>
          で Maps JavaScript API を有効化
        </li>
        <li>API キー発行 → HTTP referrer 制限（<code className="font-mono text-xs">https://kskneggy.github.io/*</code>, <code className="font-mono text-xs">http://localhost:*</code>）</li>
        <li>
          GitHub の repo Settings → Secrets → Actions に{' '}
          <code className="font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY</code> として登録
        </li>
        <li>main に push すれば再デプロイされマップ有効化</li>
        <li>
          ローカル開発: <code className="font-mono text-xs">.env.local</code> に{' '}
          <code className="font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY=AIza...</code>
        </li>
      </ol>
    </div>
  );
}
