import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { projects } from '@/config';
import { MAX_FEATURED_PROJECTS } from '@/lib/constants';
import { ProjectCard } from './ProjectCard';

export function ProjectsSection() {
  const featured = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_FEATURED_PROJECTS);

  return (
    <section id="projects" className="scroll-mt-24 border-b border-line py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="03 / projects"
            title="精选项目"
            description="每个项目都写清楚了背景、我负责的部分和最终结果。"
          />
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 rounded text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            全部项目
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
