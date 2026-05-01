export type Gender = 'mens' | 'womens' | 'unisex';
export type PriceRange = 'low' | 'mid' | 'high' | 'luxury';

export type AudienceTag =
  | 'mode'
  | 'street'
  | 'vintage'
  | 'casual'
  | 'traditional'
  | 'outdoor'
  | 'luxury'
  | 'avant_garde'
  | 'americana'
  | 'minimal'
  | 'workwear'
  | 'designer';

export type Genre =
  | 'shirt'
  | 'denim'
  | 'suit'
  | 'outerwear'
  | 'footwear'
  | 'vintage'
  | 'accessory'
  | 'bag'
  | 'knit'
  | 'tee'
  | 'eyewear'
  | 'general';

export type Coords = { lat: number; lng: number };

export type Shop = {
  id: string;
  name: string;
  name_en?: string;
  area: string;
  address?: string;
  station?: string;
  coords?: Coords;
  brands: string[];
  target_gender: Gender;
  price_range: PriceRange;
  audience_tags: AudienceTag[];
  genres: Genre[];
  description: string;
  website?: string;
  instagram?: string;
  source_urls?: string[];
};

export type BrandIndex = {
  name: string;
  shopIds: string[];
};
