import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PostCard } from '@/components/blog/PostCard';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { getAllTags, publishedPosts } from '@/lib/markdown';
import { site } from '@/config';
import { cn } from '@/lib/cn';

const ALL = '全部';

export default function BlogListPage() {
  useDocumentMeta({
    title: `文章 · ${site.author}`,
    description: '关于前端工程化、构建工具与可访问性的实践记录。',
  });

  const [activeTag, setActiveTag] = useState(ALL);
  const tags = useMemo(() => [ALL, ...getAllTags()], []);
  const posts = useMemo(
    () =>
      activeTag === ALL
        ? publishedPosts
        : publishedPosts.filter((post) => post.tags.includes(activeTag)),
    [activeTag],
  );

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

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">文章</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          共 {publishedPosts.length} 篇。内容关于构建、部署、类型设计，以及踩过的坑。
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
              className={cn(
                'rounded-full border px-3 py-1 font-mono text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                activeTag === tag
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-line bg-subtle text-muted hover:text-ink',
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t border-line">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          ) : (
            <p className="py-10 text-sm text-muted">该标签下暂无文章。</p>
          )}
        </div>
      </div>
    </Container>
  );
}
