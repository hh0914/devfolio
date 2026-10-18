import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(resetAfter = 2000): {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      let ok = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }

      if (!ok) {
        try {
          const area = document.createElement('textarea');
          area.value = text;
          area.setAttribute('readonly', '');
          area.style.position = 'fixed';
          area.style.top = '-9999px';
          document.body.appendChild(area);
          area.select();
          ok = document.execCommand('copy');
          document.body.removeChild(area);
        } catch {
          ok = false;
        }
      }

      if (ok) {
        setCopied(true);
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), resetAfter);
      }

      return ok;
    },
    [resetAfter],
  );

  return { copied, copy };
}
