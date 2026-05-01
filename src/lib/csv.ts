import type { Shop } from '../types';

function escapeCSV(value: string | number | undefined): string {
  if (value === undefined || value === null) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const COLUMNS: Array<{ header: string; get: (s: Shop) => string | number | undefined }> = [
  { header: 'name', get: (s) => s.name },
  { header: 'name_en', get: (s) => s.name_en },
  { header: 'area', get: (s) => s.area },
  { header: 'address', get: (s) => s.address },
  { header: 'station', get: (s) => s.station },
  { header: 'gender', get: (s) => s.target_gender },
  { header: 'price_range', get: (s) => s.price_range },
  { header: 'audience_tags', get: (s) => s.audience_tags.join(' / ') },
  { header: 'genres', get: (s) => s.genres.join(' / ') },
  { header: 'brand_count', get: (s) => s.brands.length },
  { header: 'brands', get: (s) => s.brands.join(' / ') },
  { header: 'rating', get: (s) => s.rating },
  { header: 'review_count', get: (s) => s.user_rating_count },
  { header: 'website', get: (s) => s.website },
  { header: 'instagram', get: (s) => s.instagram },
  { header: 'google_maps', get: (s) => s.google_maps_uri },
  { header: 'description', get: (s) => s.description },
];

export function shopsToCSV(shops: Shop[]): string {
  const header = COLUMNS.map((c) => c.header).join(',');
  const rows = shops.map((s) => COLUMNS.map((c) => escapeCSV(c.get(s))).join(','));
  return [header, ...rows].join('\n');
}

export function downloadCSV(shops: Shop[], filename = 'selectshop.csv') {
  const csv = shopsToCSV(shops);
  // BOM for Excel Japanese support
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
