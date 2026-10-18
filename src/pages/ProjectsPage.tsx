import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { projects, site } from '@/config';

export default function ProjectsPage() {
  useDocumentMeta({
    title: `项目 · ${site.author}`,
    description: '全部项目作品：背景、职责、技术方案与结果。',
  });

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          返回首页
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">项目</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          共 {sorted.length} 个项目。每个条目都包含背景、我负责的部分和技术结果。
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </Container>
  );
}
