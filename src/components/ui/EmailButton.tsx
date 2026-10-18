import { Check, Copy, Mail } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export function EmailButton({ email }: { email: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => void copy(email)}
        className="inline-flex h-11 items-center gap-3 rounded-lg border border-line bg-surface px-4 text-sm text-ink transition-colors hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-subtle"
      >
        <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
        <span className="font-mono text-[13px]">{email}</span>
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4 text-muted" aria-hidden="true" />
        )}
      </button>
      <span className="pl-1 text-[11px] text-muted" role="status" aria-live="polite">
        {copied ? '已复制到剪贴板' : '点击即可复制邮箱'}
      </span>
    </div>
  );
}
