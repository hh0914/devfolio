import { Container } from '@/components/ui/Container';
import { ScrollToTopButton } from './ScrollToTopButton';
import { profile, site } from '@/config';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted">
              © {site.footer.since}–{year} {site.author}
            </p>
            <p className="text-xs text-muted">{site.footer.note}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {profile.socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {social.label}
              </a>
            ))}
            <ScrollToTopButton />
          </div>
        </div>
      </Container>
    </footer>
  );
}
