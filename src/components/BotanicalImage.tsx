import { cn } from '../utils/cn';

type BotanicalImageProps = {
  alt: string;
  aspectClassName?: string;
  className?: string;
  fill?: boolean;
  imageClassName?: string;
  label?: string;
  src?: string;
};

const defaultImage =
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1100&q=85';

export function BotanicalImage({ alt, aspectClassName = 'aspect-[3/1]', className, fill = false, imageClassName, label, src = defaultImage }: BotanicalImageProps) {
  return (
    <div className={cn('group relative w-full overflow-hidden rounded-[2rem] border border-[#dfe5d9] bg-[#fffdf7] p-2 shadow-soft', fill && 'h-full', className)}>
      <div className={cn('relative w-full overflow-hidden rounded-[1.5rem]', fill ? 'h-full' : aspectClassName)}>
        <img
          src={src}
          alt={alt}
          className={cn('h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105', imageClassName)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#173a36]/65 via-transparent to-transparent" />
        {label ? (
          <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-[#fffdf7]/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#347c70] backdrop-blur-sm">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
