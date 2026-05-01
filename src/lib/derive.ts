import { shops } from '../data/shops';
import { shopCoords } from '../data/coords';
import { shopPhotos } from '../data/photos';
import type { Shop } from '../types';

/**
 * ブランド名の表記揺れを正規化。同じブランドが別表記で分断されないように。
 * 子ブランド（PURPLE LABEL / TOGA VIRILIS 等）は別エントリのまま残す。
 */
const brandAlias: Record<string, string> = {
  NIKE: 'Nike',
  NEEDLES: 'Needles',
  'a.presse': 'A.PRESSE',
  'Engineered Garments': 'ENGINEERED GARMENTS',
  'NEW BALANCE': 'New Balance',
  Salomon: 'SALOMON',
  CLARKS: 'Clarks',
  Pyrenex: 'PYRENEX',
  ASICS: 'asics',
};

export function normalizeBrand(name: string): string {
  return brandAlias[name] ?? name;
}

export const allShops: Shop[] = shops.map((s) => {
  const ph = shopPhotos[s.id];
  return {
    ...s,
    brands: Array.from(new Set(s.brands.map(normalizeBrand))),
    coords: shopCoords[s.id] ?? s.coords,
    image_paths: ph?.image_paths ?? [],
    place_id: ph?.place_id,
    google_maps_uri: ph?.google_maps_uri,
    rating: ph?.rating,
    user_rating_count: ph?.user_rating_count,
    photo_attributions: ph?.attributions ?? [],
  };
});

export const BASE_URL: string = (import.meta as { env: { BASE_URL: string } }).env.BASE_URL;

export const allAreas: string[] = Array.from(
  new Set(allShops.map((s) => s.area))
).sort();

export const areaCount: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const s of allShops) m[s.area] = (m[s.area] ?? 0) + 1;
  return m;
})();

export type BrandRow = {
  name: string;
  shopCount: number;
  shopIds: string[];
  areas: string[];
  topAudienceTags: string[];
  initial: string;
  previewImages: string[];
};

function getInitial(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  if (/^[A-Z]$/.test(ch)) return ch;
  return '#';
}

const brandShops = new Map<string, Shop[]>();
for (const shop of allShops) {
  for (const brand of shop.brands) {
    if (!brandShops.has(brand)) brandShops.set(brand, []);
    brandShops.get(brand)!.push(shop);
  }
}

export const allBrands: BrandRow[] = Array.from(brandShops.entries())
  .map(([name, shopsForBrand]) => {
    const tagCount = new Map<string, number>();
    for (const s of shopsForBrand) {
      for (const t of s.audience_tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    }
    const topAudienceTags = Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t);
    const previewImages = shopsForBrand
      .filter((s) => (s.image_paths?.length ?? 0) > 0)
      .sort((a, b) => (b.user_rating_count ?? 0) - (a.user_rating_count ?? 0))
      .slice(0, 3)
      .map((s) => s.image_paths![0]);
    return {
      name,
      shopCount: shopsForBrand.length,
      shopIds: shopsForBrand.map((s) => s.id),
      areas: Array.from(new Set(shopsForBrand.map((s) => s.area))),
      topAudienceTags,
      initial: getInitial(name),
      previewImages,
    };
  })
  .sort((a, b) => b.shopCount - a.shopCount || a.name.localeCompare(b.name));

export const brandInitials: string[] = Array.from(
  new Set(allBrands.map((b) => b.initial))
).sort((a, b) => {
  if (a === '#') return 1;
  if (b === '#') return -1;
  return a.localeCompare(b);
});

/**
 * 与えられたショップ集合からブランド一覧を導出。
 * ブランド単位の絞り込み（性別・価格帯・テイスト）に使う。
 */
export function brandsFromShops(shops: Shop[]): BrandRow[] {
  const map = new Map<string, Shop[]>();
  for (const shop of shops) {
    for (const brand of shop.brands) {
      if (!map.has(brand)) map.set(brand, []);
      map.get(brand)!.push(shop);
    }
  }
  return Array.from(map.entries())
    .map(([name, shopsForBrand]) => {
      const tagCount = new Map<string, number>();
      for (const s of shopsForBrand) {
        for (const t of s.audience_tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
      }
      const topAudienceTags = Array.from(tagCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t]) => t);
      const previewImages = shopsForBrand
        .filter((s) => (s.image_paths?.length ?? 0) > 0)
        .sort((a, b) => (b.user_rating_count ?? 0) - (a.user_rating_count ?? 0))
        .slice(0, 3)
        .map((s) => s.image_paths![0]);
      return {
        name,
        shopCount: shopsForBrand.length,
        shopIds: shopsForBrand.map((s) => s.id),
        areas: Array.from(new Set(shopsForBrand.map((s) => s.area))),
        topAudienceTags,
        initial: getInitial(name),
        previewImages,
      };
    })
    .sort((a, b) => b.shopCount - a.shopCount || a.name.localeCompare(b.name));
}

export function getShopById(id: string): Shop | undefined {
  return allShops.find((s) => s.id === id);
}

export function getShopsByBrand(brandName: string): Shop[] {
  return allShops.filter((s) => s.brands.includes(brandName));
}

/**
 * Jaccard 類似度でターゲット店に「品揃えが近い」店を返す。
 * Score = |A∩B| / |A∪B|（ブランド集合）
 */
export function similarShops(target: Shop, limit = 5): Array<{ shop: Shop; score: number; common: string[] }> {
  const targetSet = new Set(target.brands);
  const results: Array<{ shop: Shop; score: number; common: string[] }> = [];
  for (const s of allShops) {
    if (s.id === target.id) continue;
    const otherSet = new Set(s.brands);
    const common: string[] = [];
    for (const b of targetSet) if (otherSet.has(b)) common.push(b);
    const union = targetSet.size + otherSet.size - common.length;
    if (union === 0) continue;
    const score = common.length / union;
    if (score > 0) results.push({ shop: s, score, common });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function getBrandRow(name: string): BrandRow | undefined {
  return allBrands.find((b) => b.name === name);
}

export const allAudienceTags = [
  'mode',
  'street',
  'vintage',
  'casual',
  'traditional',
  'outdoor',
  'luxury',
  'avant_garde',
  'americana',
  'minimal',
  'workwear',
  'designer',
] as const;

export const allGenres = [
  'general',
  'shirt',
  'denim',
  'suit',
  'outerwear',
  'footwear',
  'vintage',
  'accessory',
  'bag',
  'knit',
  'tee',
  'eyewear',
] as const;

export const audienceTagLabel: Record<string, string> = {
  mode: 'モード',
  street: 'ストリート',
  vintage: 'ヴィンテージ',
  casual: 'カジュアル',
  traditional: 'トラッド',
  outdoor: 'アウトドア',
  luxury: 'ラグジュアリー',
  avant_garde: '前衛',
  americana: 'アメカジ',
  minimal: 'ミニマル',
  workwear: 'ワークウェア',
  designer: 'デザイナーズ',
};

export const genreLabel: Record<string, string> = {
  general: '総合',
  shirt: 'シャツ',
  denim: 'デニム',
  suit: 'スーツ',
  outerwear: 'アウター',
  footwear: 'シューズ',
  vintage: 'ヴィンテージ',
  accessory: 'アクセサリー',
  bag: 'バッグ',
  knit: 'ニット',
  tee: 'カットソー',
  eyewear: 'アイウェア',
};

/**
 * 価格帯ラベル。代表的なアイテム（シャツ・ブラウス等）の中央値を目安。
 * カジュアル(low) / ミドル(mid) / ハイ(high) / ラグジュアリー(luxury)
 */
export const priceLabel: Record<string, string> = {
  low: '〜¥1万',
  mid: '¥1〜3万',
  high: '¥3〜10万',
  luxury: '¥10万〜',
};

export const priceLabelLong: Record<string, string> = {
  low: 'カジュアル / 〜¥1万',
  mid: 'ミドル / ¥1〜3万',
  high: 'ハイ / ¥3〜10万',
  luxury: 'ラグジュアリー / ¥10万〜',
};

export const genderLabel: Record<string, string> = {
  mens: 'メンズ',
  womens: 'ウィメンズ',
  unisex: 'ユニセックス',
};
