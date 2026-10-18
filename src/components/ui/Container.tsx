import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('mx-auto w-full max-w-container px-5 sm:px-8', className)}>{children}</div>;
}
