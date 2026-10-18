import { ArrowUp } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export function ScrollToTopButton() {
  const reduced = usePrefersReducedMotion();

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
      }
      className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      回到顶部
      <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
