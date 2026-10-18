import { Link } from 'react-router-dom';
import { Tag } from '@/components/ui/Tag';
import { formatDate } from '@/lib/format';
import type { BlogPostMeta } from '@/types';

export function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="border-b border-line">
      <div className="grid gap-2 py-6 sm:grid-cols-[116px_1fr] sm:gap-6">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted sm:block">
          <time dateTime={post.date} className="sm:block">
            {formatDate(post.date)}
          </time>
          <span className="text-line sm:hidden" aria-hidden="true">
            ·
          </span>
          <span className="sm:mt-1 sm:block">{post.readingTime} 分钟</span>
        </div>

        <div>
          <h3 className="text-[15px] font-medium leading-6 text-ink">
            <Link
              to={`/blog/${post.slug}`}
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {post.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-[13px] leading-6 text-muted">{post.summary}</p>
          {post.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
