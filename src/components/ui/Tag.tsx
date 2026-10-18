import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-subtle px-2.5 py-0.5 font-mono text-[11px] leading-5 text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
