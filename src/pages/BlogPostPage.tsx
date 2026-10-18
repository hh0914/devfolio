import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { getPost } from '@/lib/markdown';
import { formatDate } from '@/lib/format';
import { site } from '@/config';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  useDocumentMeta({
    title: post ? `${post.title} · ${site.author}` : `文章不存在 · ${site.author}`,
    description: post?.summary,
  });

  if (!post) return <NotFoundPage />;

  return (
    <Container>
      <article className="py-12 sm:py-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 rounded text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          全部文章
        </Link>

        <header className="mt-6 max-w-3xl">
          <h1 className="text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-[32px]">
            {post.title}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted">{post.summary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} 分钟阅读</span>
            {post.updated ? (
              <>
                <span aria-hidden="true">·</span>
                <span>更新于 {formatDate(post.updated)}</span>
              </>
            ) : null}
          </div>

          {post.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </header>

        <div className="mt-10 max-w-3xl">
          <MarkdownRenderer content={post.content} />
        </div>

        <footer className="mt-12 border-t border-line pt-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 rounded text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回文章列表
          </Link>
        </footer>
      </article>
    </Container>
  );
}
