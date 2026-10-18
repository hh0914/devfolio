import { Link } from 'react-router-dom';
import { site } from '@/config';
import { cn } from '@/lib/cn';

export function DesktopNav({ activeHref }: { activeHref: string }) {
  return (
    <nav aria-label="主导航" className="hidden items-center gap-1 lg:flex">
      {site.nav.map((item) => {
        const isAnchor = item.href.startsWith('#');
        const active = activeHref === item.href;
        return (
          <Link
            key={item.href}
            to={isAnchor ? `/${item.href}` : item.href}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              active ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
