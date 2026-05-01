import { Link, useParams } from 'react-router-dom';
import { getShopById, audienceTagLabel, genderLabel, genreLabel, priceLabel } from '../lib/derive';
import { ShopImage } from '../components/ShopImage';

export function ShopDetail() {
  const { id } = useParams();
  const shop = id ? getShopById(id) : undefined;

  if (!shop) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500 mb-4">ショップが見つかりません</p>
        <Link to="/" className="text-sm underline">一覧に戻る</Link>
      </div>
    );
  }

  const images = shop.image_paths ?? [];
  const hero = images[0];
  const rest = images.slice(1);

  return (
    <article>
      <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900">← 一覧へ</Link>

      {hero && (
        <div className="mt-3 -mx-4 sm:mx-0 sm:rounded-lg overflow-hidden bg-neutral-100">
          <ShopImage
            src={hero}
            alt={`${shop.name} の店舗写真`}
            loading="eager"
            className="w-full aspect-[16/9] sm:aspect-[16/8]"
          />
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
          {rest.map((src, i) => (
            <div key={src} className="rounded-lg overflow-hidden bg-neutral-100">
              <ShopImage
                src={src}
                alt={`${shop.name} の店舗写真 ${i + 2}`}
                className="w-full aspect-square sm:aspect-[4/3]"
              />
            </div>
          ))}
        </div>
      )}

      <header className="mt-5 mb-6 pb-6 border-b border-neutral-200">
        <div className="text-sm text-neutral-500 mb-1">{shop.area}</div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 leading-tight">{shop.name}</h1>
        {shop.name_en && shop.name_en !== shop.name && (
          <div className="text-sm text-neutral-400 font-mono">{shop.name_en}</div>
        )}
        {shop.rating !== undefined && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-amber-500">★</span>
            <span className="font-semibold">{shop.rating.toFixed(1)}</span>
            {shop.user_rating_count !== undefined && (
              <span className="text-neutral-500 text-xs">({shop.user_rating_count} 件のレビュー)</span>
            )}
            {shop.google_maps_uri && (
              <a
                href={shop.google_maps_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-neutral-500 underline underline-offset-2"
              >
                Google Maps で見る →
              </a>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4 text-xs">
          <span className="bg-neutral-100 px-2 py-1 rounded">{genderLabel[shop.target_gender]}</span>
          <span className="bg-neutral-100 px-2 py-1 rounded font-mono">{priceLabel[shop.price_range]}</span>
          {shop.audience_tags.map((t) => (
            <span key={t} className="bg-neutral-100 px-2 py-1 rounded">{audienceTagLabel[t] ?? t}</span>
          ))}
          {shop.genres.filter((g) => g !== 'general').map((g) => (
            <span key={g} className="bg-neutral-100 px-2 py-1 rounded">{genreLabel[g] ?? g}</span>
          ))}
        </div>
        <p className="text-base text-neutral-700 mt-5 leading-relaxed">{shop.description}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">扱いブランド <span className="text-sm text-neutral-400 font-normal">({shop.brands.length})</span></h2>
        <div className="flex flex-wrap gap-2">
          {shop.brands.map((b) => (
            <Link
              key={b}
              to={`/brand/${encodeURIComponent(b)}`}
              className="text-sm bg-white border border-neutral-300 px-3 py-1.5 rounded hover:border-neutral-900"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 text-sm text-neutral-700 space-y-2">
        {shop.address && (
          <div>
            <span className="text-neutral-500 mr-3 inline-block w-16">住所</span>
            {shop.address}
          </div>
        )}
        {shop.station && (
          <div>
            <span className="text-neutral-500 mr-3 inline-block w-16">最寄駅</span>
            {shop.station}
          </div>
        )}
        {shop.website && (
          <div>
            <span className="text-neutral-500 mr-3 inline-block w-16">公式</span>
            <a href={shop.website} target="_blank" rel="noopener noreferrer" className="underline break-all">
              {shop.website}
            </a>
          </div>
        )}
        {shop.instagram && (
          <div>
            <span className="text-neutral-500 mr-3 inline-block w-16">Instagram</span>
            <a
              href={`https://instagram.com/${shop.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              @{shop.instagram}
            </a>
          </div>
        )}
        {shop.google_maps_uri && (
          <div>
            <span className="text-neutral-500 mr-3 inline-block w-16">Google</span>
            <a
              href={shop.google_maps_uri}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Maps
            </a>
          </div>
        )}
      </section>

      {shop.photo_attributions && shop.photo_attributions.length > 0 && (
        <p className="text-[11px] text-neutral-400 mb-4">
          写真提供: {shop.photo_attributions.join(' / ')} (Google)
        </p>
      )}

      {shop.source_urls && shop.source_urls.length > 0 && (
        <section className="text-xs text-neutral-400 border-t border-neutral-200 pt-4">
          <div className="mb-1">情報ソース</div>
          <ul className="space-y-1">
            {shop.source_urls.map((u) => (
              <li key={u}>
                <a href={u} target="_blank" rel="noopener noreferrer" className="underline break-all">
                  {u}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
