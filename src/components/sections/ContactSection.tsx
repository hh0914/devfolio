import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, BookOpen, Github, Globe, Mail, Twitter } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { EmailButton } from '@/components/ui/EmailButton';
import { profile } from '@/config';

const ICONS: Record<string, LucideIcon> = {
  Github,
  BookOpen,
  Mail,
  Twitter,
  Globe,
};

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <div className="rounded-2xl border border-line bg-subtle p-6 sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            05 / contact
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            有合适的机会，聊聊？
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            前端岗位、技术合作或者只是想交流某个实现思路，都欢迎直接发邮件。通常一个工作日内回复。
          </p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <EmailButton email={profile.email} />

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {profile.socials.map((social) => {
                const Icon = ICONS[social.icon] ?? Globe;
                const external = social.url.startsWith('http');
                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{social.label}</span>
                      {social.handle ? (
                        <span className="font-mono text-[11px] text-muted/80">
                          {social.handle}
                        </span>
                      ) : null}
                      <ArrowUpRight
                        className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
