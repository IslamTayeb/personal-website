'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};
const mountedSnapshot = () => true;
const serverSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    mountedSnapshot,
    serverSnapshot
  );

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <button
      type="button"
      aria-label="Toggle color scheme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group inline-flex items-stretch border border-border font-mono text-[10px] uppercase tracking-[0.15em]"
    >
      <span
        className={`px-2 py-1 ${
          !isDark
            ? 'bg-foreground text-background'
            : 'bg-transparent text-muted-foreground'
        }`}
      >
        Light
      </span>
      <span
        className={`border-l border-border px-2 py-1 ${
          isDark
            ? 'bg-foreground text-background'
            : 'bg-transparent text-muted-foreground'
        }`}
      >
        Dark
      </span>
    </button>
  );
}
