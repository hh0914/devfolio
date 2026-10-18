import { isValidElement, useRef, useState, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Check, Copy } from 'lucide-react';
import { rehypeHighlightSubset } from '@/lib/rehype-highlight-subset';

function CodeShell({ language, children }: { language: string; children: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时保持按钮原状 */
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-line bg-subtle">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {language || 'text'}
        </span>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre
        ref={preRef}
        className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-ink"
      >
        {children}
      </pre>
    </div>
  );
}

const components: Components = {
  pre(props) {
    const { children } = props;
    let language = '';
    if (isValidElement<{ className?: string }>(children)) {
      language = /language-([\w-]+)/.exec(children.props.className ?? '')?.[1] ?? '';
    }
    return <CodeShell language={language}>{children}</CodeShell>;
  },
  code(props) {
    const { className, children } = props;
    return <code className={className}>{children}</code>;
  },
  a(props) {
    const { href, children, title } = props;
    const external = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        title={title}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },
  table(props) {
    return (
      <div className="my-6 overflow-x-auto">
        <table>{props.children}</table>
      </div>
    );
  },
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlightSubset]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
