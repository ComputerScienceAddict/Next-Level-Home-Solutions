'use client';

import { cn } from '@/lib/utils';

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
}: MarqueeProps) {
  const duration = typeof className === 'string' && className.includes('--duration') ? undefined : '20s';

  return (
    <div
      className={cn(
        'group flex overflow-hidden',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      <div
        className={cn(
          'inline-flex shrink-0 gap-4',
          vertical ? 'flex-col' : 'flex-row',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
        style={{ '--duration': duration || '20s' } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
