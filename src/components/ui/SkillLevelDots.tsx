import type { SkillLevel } from '@/types';
import { cn } from '@/lib/cn';

const LABELS: Record<SkillLevel, string> = {
  expert: '精通',
  advanced: '熟练',
  proficient: '熟悉',
  learning: '了解',
};

const COUNT: Record<SkillLevel, number> = {
  expert: 4,
  advanced: 3,
  proficient: 2,
  learning: 1,
};

export function SkillLevelDots({ level }: { level: SkillLevel }) {
  const filled = COUNT[level];
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="text-[11px] text-muted">{LABELS[level]}</span>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={cn('h-1 w-2.5 rounded-full', index < filled ? 'bg-accent' : 'bg-line')}
          />
        ))}
      </span>
    </span>
  );
}
