import { Link, useParams } from 'react-router-dom';
import { getShopById, audienceTagLabel, genderLabel, genreLabel, priceLabel } from '../lib/derive';

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

  return (
    <article>
      <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900">← 一覧へ</Link>
      <header className="mt-3 mb-6 pb-6 border-b border-neutral-200">
        <div className="text-sm text-neutral-500 mb-1">{shop.area}</div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">{shop.name}</h1>
        {shop.name_en && shop.name_en !== shop.name && (
          <div className="text-sm text-neutral-400 font-mono">{shop.name_en}</div>
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
            <span className="text-neutral-500 mr-3">住所</span>
            {shop.address}
          </div>
        )}
        {shop.station && (
          <div>
            <span className="text-neutral-500 mr-3">最寄駅</span>
            {shop.station}
          </div>
        )}
        {shop.website && (
          <div>
            <span className="text-neutral-500 mr-3">公式</span>
            <a href={shop.website} target="_blank" rel="noopener noreferrer" className="underline break-all">
              {shop.website}
            </a>
          </div>
        )}
        {shop.instagram && (
          <div>
            <span className="text-neutral-500 mr-3">Instagram</span>
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
      </section>

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
