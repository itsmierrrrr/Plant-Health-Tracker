import { cn } from '../utils/cn';
import { useState } from 'react';

type ResponsiveImageProps = {
  alt: string;
  className?: string;
  eager?: boolean;
  fallbackSrc?: string;
  sizes?: string;
  src: string;
};

export function ResponsiveImage({
  alt,
  className,
  eager = false,
  fallbackSrc = '/plant.png',
  sizes = '100vw',
  src,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedSrc, setResolvedSrc] = useState(src);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#E8F0D8]">
      {isLoading ? <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#E8F0D8] via-[#D8E3C9] to-[#E8F0D8]" aria-hidden="true" /> : null}
      <img
        src={resolvedSrc}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (resolvedSrc !== fallbackSrc) {
            setResolvedSrc(fallbackSrc);
            return;
          }
          setIsLoading(false);
        }}
        className={cn('h-full w-full object-cover transition duration-500', isLoading ? 'opacity-0' : 'opacity-100', className)}
      />
    </div>
  );
}
