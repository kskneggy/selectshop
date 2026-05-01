import type { Coords } from '../types';

/**
 * 各ショップの緯度経度。住所ベースの近似値（50店、明日のデモ用に手動付与）。
 * Phase 2 で公式サイト等から自動取得 or Nominatim 経由で精度向上予定。
 */
export const shopCoords: Record<string, Coords> = {
  // 渋谷 / 神南
  'tomorrowland-shibuya': { lat: 35.6608, lng: 139.7038 },
  'ships-shibuya': { lat: 35.6628, lng: 139.7000 },
  'adam-et-rope-shibuya-parco': { lat: 35.6614, lng: 139.6970 },
  'studious-jinnan': { lat: 35.6643, lng: 139.6989 },
  'nano-universe-jinnan': { lat: 35.6627, lng: 139.6996 },
  'beams-men-shibuya': { lat: 35.6622, lng: 139.6985 },
  'united-arrows-scramble-square': { lat: 35.6580, lng: 139.7016 },
  'freaks-store-shibuya': { lat: 35.6620, lng: 139.6976 },
  '417-edifice-shibuya': { lat: 35.6624, lng: 139.6987 },
  'midwest-tokyo': { lat: 35.6644, lng: 139.6990 },
  'lechoppe-miyashita-park': { lat: 35.6635, lng: 139.7027 },
  'fan-shibuya-parco': { lat: 35.6614, lng: 139.6970 },
  'garden-shibuya': { lat: 35.6632, lng: 139.6989 },
  'ware-mo-kou': { lat: 35.6630, lng: 139.6995 },
  'n-id-tokyo': { lat: 35.6640, lng: 139.7000 },
  'sullen-tokyo': { lat: 35.6618, lng: 139.6979 },
  'globe-specs-shibuya': { lat: 35.6635, lng: 139.6995 },
  'nordisk-camp-supply-shibuya': { lat: 35.6614, lng: 139.6970 },
  'vintage-qoo-tokyo': { lat: 35.6597, lng: 139.6997 },

  // 中目黒
  'roots-to-branches': { lat: 35.6452, lng: 139.6960 },
  'so-nakameguro': { lat: 35.6470, lng: 139.6963 },
  '1ldk-nakameguro': { lat: 35.6470, lng: 139.7012 },
  'bechics': { lat: 35.6440, lng: 139.6940 },
  'best-packing-store': { lat: 35.6444, lng: 139.6948 },
  'elementary-store-bin': { lat: 35.6463, lng: 139.6957 },
  'vendor': { lat: 35.6443, lng: 139.6948 },
  'the-galley-box': { lat: 35.6448, lng: 139.6953 },
  'coper': { lat: 35.6473, lng: 139.7016 },
  'fifth-general-store': { lat: 35.6432, lng: 139.6986 },

  // 表参道 / 青山 / 神宮前
  'the-library-omotesando': { lat: 35.6679, lng: 139.7080 },
  'lechoppe-aoyama': { lat: 35.6638, lng: 139.7148 },
  'h-beauty-and-youth': { lat: 35.6643, lng: 139.7141 },
  'super-a-market-aoyama': { lat: 35.6635, lng: 139.7150 },
  'district-united-arrows': { lat: 35.6663, lng: 139.7080 },
  '1ldk-aoyama': { lat: 35.6635, lng: 139.7090 },
  'edition-omotesando-hills': { lat: 35.6677, lng: 139.7095 },
  'adelaide': { lat: 35.6685, lng: 139.7090 },
  'international-gallery-beams': { lat: 35.6713, lng: 139.7060 },
  'nepenthes-tokyo': { lat: 35.6700, lng: 139.7060 },
  'arts-and-science-aoyama': { lat: 35.6588, lng: 139.7165 },

  // 代官山
  'lift-daikanyama': { lat: 35.6480, lng: 139.7028 },
  'haunt-daikanyama': { lat: 35.6485, lng: 139.7035 },
  'forget-me-nots-daikanyama': { lat: 35.6478, lng: 139.7038 },
  'select-shop-o-daikanyama': { lat: 35.6492, lng: 139.7028 },
  'high-standard-daikanyama': { lat: 35.6488, lng: 139.7042 },
  'hedy-daikanyama': { lat: 35.6483, lng: 139.7045 },

  // 原宿
  'studious-mens-harajuku': { lat: 35.6700, lng: 139.7035 },
  'nubian-harajuku': { lat: 35.6717, lng: 139.7048 },
  'maidens-shop': { lat: 35.6750, lng: 139.7075 },
  'freshservice-headquarters': { lat: 35.6710, lng: 139.7080 },
  'lantiki-centraaaaal': { lat: 35.6705, lng: 139.7045 },

  // 六本木 / 乃木坂
  'estnation-roppongi': { lat: 35.6604, lng: 139.7292 },
  'restir-nogizaka': { lat: 35.6655, lng: 139.7290 },

  // 銀座 / 有楽町 / 日比谷
  'dover-street-market-ginza': { lat: 35.6699, lng: 139.7613 },
  'beams-ginza': { lat: 35.6740, lng: 139.7672 },
  'ships-ginza': { lat: 35.6708, lng: 139.7615 },
  'undercover-ginza-six': { lat: 35.6694, lng: 139.7625 },
  'soph-ginza-six': { lat: 35.6694, lng: 139.7625 },
  'mastermind-tokyo-hibiya': { lat: 35.6735, lng: 139.7596 },
  'tatras-concept-store-hibiya': { lat: 35.6735, lng: 139.7596 },
  'hankyu-mens-tokyo': { lat: 35.6754, lng: 139.7626 },

  // 新宿
  'beams-japan-shinjuku': { lat: 35.6920, lng: 139.7050 },
  'isetan-mens-shinjuku': { lat: 35.6920, lng: 139.7060 },
  'wism-shinjuku': { lat: 35.6900, lng: 139.7048 },

  // 丸の内
  'arts-and-science-marunouchi': { lat: 35.6824, lng: 139.7669 },
  'estnation-yurakucho': { lat: 35.6750, lng: 139.7637 },
  'beams-house-marunouchi': { lat: 35.6810, lng: 139.7660 },
  'beams-plus-yurakucho': { lat: 35.6741, lng: 139.7637 },
  'the-tokyo-marunouchi': { lat: 35.6810, lng: 139.7660 },
  'tomorrowland-marunouchi': { lat: 35.6810, lng: 139.7660 },
  'land-of-tomorrow-marunouchi': { lat: 35.6810, lng: 139.7660 },
  'le-dome-marunouchi': { lat: 35.6810, lng: 139.7660 },
};
