import { ArrowDown, Download, Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { profile } from '@/config';

export function HeroSection() {
  return (
    <section id="home" className="border-b border-line">
      <Container>
        <div className="grid gap-14 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-3 py-1 font-mono text-[11px] text-muted">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {profile.availability.text}
              </span>
              <span className="font-mono text-[11px] text-muted">
                {profile.location} · UTC+8
              </span>
            </div>

            <h1 className="mt-7 text-[38px] font-semibold leading-[1.15] tracking-tightest text-ink sm:text-5xl">
              {profile.name}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-muted">
              <span className="text-ink">{profile.role}</span>
              <span className="text-line" aria-hidden="true">
                /
              </span>
              <span className="font-mono text-[13px]">{profile.headline.join(' · ')}</span>
            </p>

            <p className="mt-6 max-w-xl text-[17px] leading-8 text-muted">{profile.slogan}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#projects">
                查看项目
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={profile.resumeUrl} variant="secondary" download>
                下载简历
                <Download className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#contact" variant="ghost">
                联系我
                <Mail className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[260px] lg:mx-0 lg:ml-auto">
            <div className="relative">
              <div
                className="absolute -inset-2.5 rounded-3xl border border-line"
                aria-hidden="true"
              />
              <img
                src={profile.avatar}
                alt={profile.avatarAlt}
                width={400}
                height={400}
                className="relative aspect-square w-full rounded-2xl border border-line bg-subtle object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
