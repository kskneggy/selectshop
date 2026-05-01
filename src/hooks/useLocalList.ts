import { useEffect, useState, useCallback } from 'react';

export function useLocalList(key: string, max?: number) {
  const [items, setItems] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [key, items]);

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key) return;
      try {
        const next = e.newValue ? (JSON.parse(e.newValue) as string[]) : [];
        if (Array.isArray(next)) setItems(next);
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const add = useCallback(
    (id: string) => {
      setItems((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        if (max && next.length > max) return next.slice(-max);
        return next;
      });
    },
    [max]
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x !== id));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        const next = [...prev, id];
        if (max && next.length > max) return next.slice(-max);
        return next;
      });
    },
    [max]
  );

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback((id: string) => items.includes(id), [items]);

  return { items, add, remove, toggle, clear, has, count: items.length };
}
