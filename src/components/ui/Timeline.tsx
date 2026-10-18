import { formatMonth } from '@/lib/format';
import type { TimelineItem } from '@/types';
import { Tag } from '@/components/ui/Tag';

export function Timeline({ items }: { items: TimelineItem[] }) {
  const sorted = [...items].sort((a, b) => (a.start < b.start ? 1 : -1));

  return (
    <ol className="relative space-y-8 border-l border-line pl-6">
      {sorted.map((item) => (
        <li key={item.id} className="relative">
          <span
            className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-page bg-accent"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-sm font-medium text-ink">
              {item.title}
              <span className="ml-2 font-normal text-muted">@ {item.org}</span>
            </h3>
            <span className="font-mono text-[11px] text-muted">
              {formatMonth(item.start)} — {formatMonth(item.end)}
            </span>
          </div>
          {item.location ? <p className="mt-1 text-xs text-muted">{item.location}</p> : null}
          {item.summary ? (
            <p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p>
          ) : null}
          {item.highlights?.length ? (
            <ul className="mt-2 space-y-1">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2 text-[13px] leading-6 text-muted">
                  <span
                    className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-line"
                    aria-hidden="true"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {item.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
