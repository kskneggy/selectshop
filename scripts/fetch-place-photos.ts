/**
 * 各ショップの Google Places 情報＋写真を取得して
 *   - 写真を `public/images/shops/{id}/{N}.jpg` に保存
 *   - メタデータを `src/data/photos.ts` に出力
 *
 * 使い方:
 *   echo "GOOGLE_MAPS_API_KEY=AIza..." >> .env.local
 *   pnpm tsx scripts/fetch-place-photos.ts
 *
 * 必要API: Places API (New)
 *   https://places.googleapis.com/v1/places:searchText
 *   https://places.googleapis.com/v1/{photo_resource}/media
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { shops } from '../src/data/shops';
import { shopCoords } from '../src/data/coords';

const KEY = process.env.GOOGLE_MAPS_API_KEY ?? process.env.VITE_GOOGLE_MAPS_API_KEY;
if (!KEY) {
  console.error('GOOGLE_MAPS_API_KEY not set. Add to .env.local');
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_IMG_DIR = path.join(ROOT, 'public', 'images', 'shops');
const OUT_DATA = path.join(ROOT, 'src', 'data', 'photos.ts');
const PHOTOS_PER_SHOP = 3;
const MAX_WIDTH_PX = 1200;

type Place = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions?: Array<{ displayName: string; uri?: string }>;
  }>;
};

async function searchPlace(query: string, lat?: number, lng?: number): Promise<Place | null> {
  const body: Record<string, unknown> = {
    textQuery: query,
    languageCode: 'ja',
    regionCode: 'JP',
    maxResultCount: 1,
  };
  if (lat !== undefined && lng !== undefined) {
    body.locationBias = {
      circle: { center: { latitude: lat, longitude: lng }, radius: 300 },
    };
  }
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY!,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.rating,places.userRatingCount,places.photos',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`searchText ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { places?: Place[] };
  return data.places?.[0] ?? null;
}

async function downloadPhoto(photoName: string, dest: string) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?key=${KEY}&maxWidthPx=${MAX_WIDTH_PX}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`photo ${res.status}: ${url.slice(0, 80)}...`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf.length;
}

type PhotoRow = {
  place_id: string;
  google_maps_uri?: string;
  rating?: number;
  user_rating_count?: number;
  image_paths: string[];
  attributions: string[];
};

async function processShop(shopId: string, name: string, area: string, address?: string): Promise<PhotoRow | null> {
  const coords = shopCoords[shopId];
  const queries = [
    address ? `${name} ${address}` : null,
    `${name} ${area}`,
    name,
  ].filter(Boolean) as string[];

  let place: Place | null = null;
  for (const q of queries) {
    place = await searchPlace(q, coords?.lat, coords?.lng);
    if (place) break;
  }
  if (!place) {
    console.log(`  [miss] ${shopId}`);
    return null;
  }
  const found = place.displayName?.text ?? '(no name)';
  const photoCount = place.photos?.length ?? 0;
  console.log(`  [hit ] ${shopId} -> ${found} (${photoCount}枚)`);

  if (!place.photos || photoCount === 0) {
    return {
      place_id: place.id,
      google_maps_uri: place.googleMapsUri,
      rating: place.rating,
      user_rating_count: place.userRatingCount,
      image_paths: [],
      attributions: [],
    };
  }

  await fs.mkdir(path.join(OUT_IMG_DIR, shopId), { recursive: true });
  const photos = place.photos.slice(0, PHOTOS_PER_SHOP);
  const imagePaths: string[] = [];
  const attributions: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const dest = path.join(OUT_IMG_DIR, shopId, `${i + 1}.jpg`);
    try {
      const bytes = await downloadPhoto(photo.name, dest);
      imagePaths.push(`images/shops/${shopId}/${i + 1}.jpg`);
      const attr = photo.authorAttributions?.[0]?.displayName;
      if (attr) attributions.push(attr);
      console.log(`    -> ${i + 1}.jpg (${(bytes / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.error(`    photo ${i + 1} failed:`, e instanceof Error ? e.message : e);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  return {
    place_id: place.id,
    google_maps_uri: place.googleMapsUri,
    rating: place.rating,
    user_rating_count: place.userRatingCount,
    image_paths: imagePaths,
    attributions: Array.from(new Set(attributions)),
  };
}

async function main() {
  await fs.mkdir(OUT_IMG_DIR, { recursive: true });
  const result: Record<string, PhotoRow> = {};
  let i = 0;
  for (const shop of shops) {
    i++;
    console.log(`[${i}/${shops.length}] ${shop.name}`);
    try {
      const row = await processShop(shop.id, shop.name, shop.area, shop.address);
      if (row) result[shop.id] = row;
    } catch (e) {
      console.error(`  [err ] ${shop.id}:`, e instanceof Error ? e.message : e);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  const ts = `// Auto-generated by scripts/fetch-place-photos.ts
// Do not edit manually. Re-run the script to refresh.

export type ShopPhotos = {
  place_id: string;
  google_maps_uri?: string;
  rating?: number;
  user_rating_count?: number;
  image_paths: string[];
  attributions: string[];
};

export const shopPhotos: Record<string, ShopPhotos> = ${JSON.stringify(result, null, 2)};
`;
  await fs.writeFile(OUT_DATA, ts);
  const hits = Object.keys(result).length;
  const totalImages = Object.values(result).reduce((sum, r) => sum + r.image_paths.length, 0);
  console.log(`\nDone. ${hits}/${shops.length} shops matched, ${totalImages} photos downloaded.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
