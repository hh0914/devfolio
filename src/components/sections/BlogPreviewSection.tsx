import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PostCard } from '@/components/blog/PostCard';
import { publishedPosts } from '@/lib/markdown';
import { blogConfig } from '@/config';

export function BlogPreviewSection() {
  const posts = publishedPosts.slice(0, blogConfig.previewCount);

  return (
    <section id="blog" className="scroll-mt-24 border-b border-line py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="04 / writing"
            title="最近写的"
            description="把踩过的坑整理成可以复用的结论。"
          />
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 rounded text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            全部文章
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="mt-8 border-t border-line">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">还没有发布的文章。</p>
        )}
      </Container>
    </section>
  );
}
