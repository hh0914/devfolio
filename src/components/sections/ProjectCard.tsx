import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { Tag } from '@/components/ui/Tag';
import type { Project } from '@/types';

export function ProjectCard({ project }: { project: Project }) {
  const { links } = project;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent/50">
      <Link
        to={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="block border-b border-line bg-subtle"
      >
        <img
          src={project.cover}
          alt={project.coverAlt}
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-medium leading-6 text-ink">
          <Link
            to={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-6 text-muted">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-line/70 pt-3.5 text-[13px]">
          {links.github ? (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              源码
            </a>
          ) : null}
          {links.demo ? (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              在线预览
            </a>
          ) : null}
          <Link
            to={`/projects/${project.slug}`}
            className="ml-auto inline-flex items-center gap-1 text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            详情
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
