import { BASE_URL } from '../lib/derive';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
};

export function ShopImage({ src, alt, className, loading = 'lazy' }: Props) {
  if (!src) {
    return (
      <div
        className={`bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs ${className ?? ''}`}
        role="img"
        aria-label={alt}
      >
        no image
      </div>
    );
  }
  return (
    <img
      src={`${BASE_URL}${src}`}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`object-cover ${className ?? ''}`}
    />
  );
}
