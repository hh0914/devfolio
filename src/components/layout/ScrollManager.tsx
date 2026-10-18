import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/** 路由切换：无 hash 回顶部；有 hash 滚动到锚点（含跨页锚点）。 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const raf = window.requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0 });
        }
      });
      return () => window.cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash, reduced]);

  return null;
}
