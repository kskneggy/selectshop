import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import { allShops, audienceTagLabel, genderLabel, priceLabel } from '../lib/derive';
import { applyFilter, emptyFilter } from '../lib/filter';
import { FilterBar } from '../components/FilterBar';

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const TOKYO_CENTER: [number, number] = [35.66, 139.71];

export function MapPage() {
  const [filter, setFilter] = useState(emptyFilter);
  const filtered = useMemo(() => applyFilter(allShops, filter), [filter]);
  const withCoords = filtered.filter((s) => s.coords);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          マップで探す
        </h1>
        <p className="text-sm text-neutral-500">
          フィルタを絞り込んで地図上で位置関係を把握。マーカークリックで詳細へ。
        </p>
      </div>
      <FilterBar filter={filter} setFilter={setFilter} resultCount={withCoords.length} />
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <MapContainer
          center={TOKYO_CENTER}
          zoom={13}
          style={{ height: '70vh', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map((shop) => (
            <Marker key={shop.id} position={[shop.coords!.lat, shop.coords!.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <div className="text-xs text-neutral-500 mb-0.5">{shop.area}</div>
                  <div className="font-semibold text-base mb-1">{shop.name}</div>
                  <div className="text-xs text-neutral-600 mb-2">
                    {genderLabel[shop.target_gender]} ·{' '}
                    <span className="font-mono">{priceLabel[shop.price_range]}</span> ·{' '}
                    {shop.audience_tags.slice(0, 2).map((t) => audienceTagLabel[t] ?? t).join(' / ')}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {shop.brands.slice(0, 4).map((b) => (
                      <span key={b} className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded">
                        {b}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/shop/${shop.id}`}
                    className="text-xs underline text-neutral-900"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {withCoords.length < filtered.length && (
        <p className="text-xs text-neutral-400 mt-2">
          ※ {filtered.length - withCoords.length} 店は座標未登録のため地図に表示されません
        </p>
      )}
    </div>
  );
}
