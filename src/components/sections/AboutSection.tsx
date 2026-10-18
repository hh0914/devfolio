import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Timeline } from '@/components/ui/Timeline';
import { experiences, profile } from '@/config';

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 border-b border-line py-16 sm:py-20">
      <Container>
        <SectionHeading
          index="01 / about"
          title="关于我"
          description="一段自我介绍，以及走到今天的时间线。"
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="space-y-5">
            {profile.bio.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-7 text-muted">
                {paragraph}
              </p>
            ))}
            <dl className="grid grid-cols-[72px_1fr] gap-y-2 border-t border-line pt-5 text-sm">
              <dt className="text-muted">所在城市</dt>
              <dd className="text-ink">{profile.location}</dd>
              <dt className="text-muted">当前状态</dt>
              <dd className="text-ink">{profile.availability.text}</dd>
            </dl>
          </div>

          <Timeline items={experiences} />
        </div>
      </Container>
    </section>
  );
}
