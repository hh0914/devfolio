import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillLevelDots } from '@/components/ui/SkillLevelDots';
import { skillGroups } from '@/config';

export function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 border-b border-line py-16 sm:py-20">
      <Container>
        <SectionHeading
          index="02 / skills"
          title="技能栈"
          description="按使用场景分组。标注的是熟练程度，不是使用时长。"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-medium text-ink">{group.title}</h3>
                <span className="font-mono text-[11px] text-muted">{group.skills.length} 项</span>
              </div>
              {group.description ? (
                <p className="mt-1.5 text-xs leading-5 text-muted">{group.description}</p>
              ) : null}
              <ul className="mt-4 divide-y divide-line/70">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0"
                  >
                    <span className="text-[13px] text-ink">{skill.name}</span>
                    <SkillLevelDots level={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
