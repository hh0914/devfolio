import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { site } from '@/config';

export function NotFoundPage() {
  useDocumentMeta({
    title: `页面不存在 · ${site.author}`,
    description: '请求的页面不存在，可返回首页继续浏览。',
  });

  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col justify-center py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">error 404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          这一页不存在
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          可能是链接过期，或者地址输入有误。可以回到首页重新找，或者直接看文章列表。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">返回首页</ButtonLink>
          <Link
            to="/blog"
            className="inline-flex h-11 items-center rounded-lg border border-line px-5 text-sm text-ink transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            浏览文章
          </Link>
        </div>
      </div>
    </Container>
  );
}
