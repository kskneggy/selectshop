import type { Shop, Gender, PriceRange, AudienceTag, Genre } from '../types';

export type FilterState = {
  query: string;
  areas: string[];
  genders: Gender[];
  prices: PriceRange[];
  audiences: AudienceTag[];
  genres: Genre[];
  brand: string | null;
};

export const emptyFilter: FilterState = {
  query: '',
  areas: [],
  genders: [],
  prices: [],
  audiences: [],
  genres: [],
  brand: null,
};

export function applyFilter(shops: Shop[], f: FilterState): Shop[] {
  const q = f.query.trim().toLowerCase();
  return shops.filter((s) => {
    if (f.areas.length && !f.areas.includes(s.area)) return false;
    if (f.genders.length && !f.genders.includes(s.target_gender)) return false;
    if (f.prices.length && !f.prices.includes(s.price_range)) return false;
    if (f.audiences.length && !f.audiences.some((t) => s.audience_tags.includes(t))) return false;
    if (f.genres.length && !f.genres.some((g) => s.genres.includes(g))) return false;
    if (f.brand && !s.brands.includes(f.brand)) return false;
    if (q) {
      const hay = [
        s.name,
        s.name_en ?? '',
        s.area,
        s.description,
        ...s.brands,
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
