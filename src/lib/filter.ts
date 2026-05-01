import type { Shop, Gender, PriceRange, AudienceTag, Genre } from '../types';
import { brandKana } from '../data/brandKana';

export type SortKey = 'popular' | 'rating' | 'brands' | 'price_asc' | 'price_desc' | 'alpha' | 'kana' | 'area';

export type FilterState = {
  query: string;
  areas: string[];
  genders: Gender[];
  prices: PriceRange[];
  audiences: AudienceTag[];
  genres: Genre[];
  brand: string | null;
  sort: SortKey;
};

export const emptyFilter: FilterState = {
  query: '',
  areas: [],
  genders: [],
  prices: [],
  audiences: [],
  genres: [],
  brand: null,
  sort: 'popular',
};

const priceOrder: Record<PriceRange, number> = { low: 0, mid: 1, high: 2, luxury: 3 };

export function applyFilter(shops: Shop[], f: FilterState): Shop[] {
  const q = f.query.trim().toLowerCase();
  const filtered = shops.filter((s) => {
    if (f.areas.length && !f.areas.includes(s.area)) return false;
    if (f.genders.length && !f.genders.includes(s.target_gender)) return false;
    if (f.prices.length && !f.prices.includes(s.price_range)) return false;
    if (f.audiences.length && !f.audiences.some((t) => s.audience_tags.includes(t))) return false;
    if (f.genres.length && !f.genres.some((g) => s.genres.includes(g))) return false;
    if (f.brand && !s.brands.includes(f.brand)) return false;
    if (q) {
      const brandTokens = s.brands.flatMap((b) => {
        const kana = brandKana[b];
        return kana ? [b, kana] : [b];
      });
      const hay = [s.name, s.name_en ?? '', s.area, s.description, ...brandTokens].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return sortShops(filtered, f.sort);
}

export function sortShops(shops: Shop[], sort: SortKey): Shop[] {
  const sorted = [...shops];
  switch (sort) {
    case 'rating':
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case 'brands':
      sorted.sort((a, b) => b.brands.length - a.brands.length);
      break;
    case 'price_asc':
      sorted.sort((a, b) => priceOrder[a.price_range] - priceOrder[b.price_range]);
      break;
    case 'price_desc':
      sorted.sort((a, b) => priceOrder[b.price_range] - priceOrder[a.price_range]);
      break;
    case 'alpha':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'en'));
      break;
    case 'kana':
      sorted.sort((a, b) => {
        const aJa = /^[ぁ-んァ-ヶ一-龥]/.test(a.name) ? 0 : 1;
        const bJa = /^[ぁ-んァ-ヶ一-龥]/.test(b.name) ? 0 : 1;
        if (aJa !== bJa) return aJa - bJa;
        return a.name.localeCompare(b.name, 'ja');
      });
      break;
    case 'area':
      sorted.sort((a, b) => a.area.localeCompare(b.area, 'ja') || a.name.localeCompare(b.name, 'ja'));
      break;
    case 'popular':
    default:
      sorted.sort((a, b) => {
        const popA = (a.rating ?? 0) * Math.log10((a.user_rating_count ?? 0) + 1);
        const popB = (b.rating ?? 0) * Math.log10((b.user_rating_count ?? 0) + 1);
        return popB - popA;
      });
  }
  return sorted;
}

export const sortLabel: Record<SortKey, string> = {
  popular: 'おすすめ順',
  rating: '評価が高い順',
  brands: '取扱ブランドが多い順',
  price_asc: '価格 低い順',
  price_desc: '価格 高い順',
  alpha: '店名 ABC順',
  kana: '店名 五十音順',
  area: 'エリア順',
};

export const sortDescription: Record<SortKey, string> = {
  popular: 'Google評価 × 口コミ数で算出した総合スコア',
  rating: 'Googleの星評価（高い順）',
  brands: '取り扱いブランド数（多い順）',
  price_asc: '価格帯（低い順）',
  price_desc: '価格帯（高い順）',
  alpha: '店名のアルファベット順（A→Z）',
  kana: '日本語の店名から順に（あ→ん）',
  area: 'エリア名順（同エリア内は店名順）',
};
