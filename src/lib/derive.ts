import { shops } from '../data/shops';
import type { Shop } from '../types';

export const allShops: Shop[] = shops;

export const allAreas: string[] = Array.from(
  new Set(shops.map((s) => s.area))
).sort();

export type BrandRow = {
  name: string;
  shopCount: number;
  shopIds: string[];
};

const brandMap = new Map<string, Set<string>>();
for (const shop of shops) {
  for (const brand of shop.brands) {
    const key = brand;
    if (!brandMap.has(key)) brandMap.set(key, new Set());
    brandMap.get(key)!.add(shop.id);
  }
}

export const allBrands: BrandRow[] = Array.from(brandMap.entries())
  .map(([name, set]) => ({
    name,
    shopCount: set.size,
    shopIds: Array.from(set),
  }))
  .sort((a, b) => b.shopCount - a.shopCount || a.name.localeCompare(b.name));

export function getShopById(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function getShopsByBrand(brandName: string): Shop[] {
  return shops.filter((s) => s.brands.includes(brandName));
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

export const priceLabel: Record<string, string> = {
  low: '〜',
  mid: '￥￥',
  high: '￥￥￥',
  luxury: '￥￥￥￥',
};

export const genderLabel: Record<string, string> = {
  mens: 'メンズ',
  womens: 'ウィメンズ',
  unisex: 'ユニセックス',
};
