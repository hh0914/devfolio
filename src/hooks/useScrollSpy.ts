import { useEffect, useState } from 'react';

/**
 * 返回当前滚动位置命中的区块 id。
 * ids 会被拼成字符串参与依赖比较，调用方可以安全传入字面量数组。
 */
export function useScrollSpy(ids: readonly string[], offset = 96): string {
  const [activeId, setActiveId] = useState('');
  const key = ids.join(',');

  useEffect(() => {
    const list = key.split(',').filter(Boolean);

    const handleScroll = () => {
      let current = '';
      for (const id of list) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [key, offset]);

  return activeId;
}
