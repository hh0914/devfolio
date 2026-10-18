import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { site } from '@/config';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { SECTION_IDS } from '@/lib/constants';
import { cn } from '@/lib/cn';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const activeSection = useScrollSpy(SECTION_IDS);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const routeActive =
    site.nav.find((item) => item.href.startsWith('/') && location.pathname.startsWith(item.href))
      ?.href ?? '';
  const activeHref = isHome ? (activeSection ? `#${activeSection}` : '') : routeActive;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-colors duration-200',
        scrolled ? 'border-b border-line bg-page/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-baseline gap-1 rounded font-mono text-sm font-medium tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>{site.author}</span>
            <span className="text-muted">/frontend</span>
          </Link>

          <DesktopNav activeHref={activeHref} />

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <MobileMenu activeHref={activeHref} />
          </div>
        </div>
      </Container>
    </header>
  );
}
