import { cn } from '../utils/cn';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ResponsiveImage } from './ResponsiveImage';

type BotanicalImageProps = {
  alt: string;
  aspectClassName?: string;
  className?: string;
  fill?: boolean;
  draggable?: boolean;
  imageClassName?: string;
  label?: string;
  src?: string;
};

const defaultImage =
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1100&q=85';

export function BotanicalImage({ alt, aspectClassName = 'aspect-[3/1]', className, draggable = false, fill = false, imageClassName, label, src = defaultImage }: BotanicalImageProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || event.button !== 0) {
      return;
    }

    dragStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    setDragOffset({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const resetDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn('group relative w-full overflow-hidden rounded-[2rem] border border-[#dfe5d9] bg-[#fffdf7] p-2 shadow-soft', draggable && 'cursor-grab touch-none select-none active:cursor-grabbing', fill && 'h-full', className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={resetDrag}
      onPointerCancel={resetDrag}
      style={{ transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)` }}
    >
      <div className={cn('relative w-full overflow-hidden rounded-[1.5rem]', fill ? 'h-full' : aspectClassName)}>
        <ResponsiveImage
          src={src}
          alt={alt}
          eager
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn('object-center transition duration-700 ease-out group-hover:scale-105', imageClassName)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#173a36]/65 via-transparent to-transparent" />
        {label ? (
          <span className="absolute bottom-4 left-4 rounded-full border border-[#dfe5d9] bg-[#fffdf7]/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#347c70] backdrop-blur-sm">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
