import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { projects, site } from '@/config';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projects.find((item) => item.slug === slug) : undefined;

  useDocumentMeta({
    title: project ? `${project.title} · ${site.author}` : `项目不存在 · ${site.author}`,
    description: project?.summary,
  });

  if (!project) return <NotFoundPage />;

  return (
    <Container>
      <article className="py-12 sm:py-16">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 rounded text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          全部项目
        </Link>

        <header className="mt-6 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {project.title}
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-muted">{project.summary}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] text-muted">
            {project.role ? (
              <div className="flex gap-2">
                <dt>角色</dt>
                <dd className="text-ink">{project.role}</dd>
              </div>
            ) : null}
            {project.period ? (
              <div className="flex gap-2">
                <dt>周期</dt>
                <dd className="text-ink">{project.period}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt>技术栈</dt>
              <dd className="text-ink">{project.stack.join(' / ')}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                源码
              </a>
            ) : null}
            {project.links.demo ? (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                在线预览
              </a>
            ) : null}
            {project.links.article ? (
              <a
                href={project.links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-[13px] text-ink transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                相关文章
              </a>
            ) : null}
          </div>
        </header>

        <img
          src={project.cover}
          alt={project.coverAlt}
          width={1200}
          height={750}
          className="mt-10 aspect-[16/10] w-full rounded-xl border border-line bg-subtle object-cover"
        />

        {project.highlights?.length ? (
          <section className="mt-10 rounded-xl border border-line bg-subtle p-5 sm:p-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">结果</h2>
            <ul className="mt-3 space-y-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2 text-sm leading-6 text-ink">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 max-w-3xl">
          <MarkdownRenderer content={project.description} />
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-6">
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      </article>
    </Container>
  );
}
