import { useCallback, useEffect, useState } from 'react';
import { applyTheme, getCurrentTheme, type Theme } from '@/lib/theme';

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  }, []);

  return { theme, toggle };
}
