'use client';

import { useEffect, useSyncExternalStore } from 'react';

type ThemeName = 'light' | 'dark';
const listeners = new Set<() => void>();
let currentTheme: ThemeName = 'light';

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentTheme;
}

function getServerSnapshot() {
  return 'light' as const;
}

function readTheme(): ThemeName {
  const saved = window.localStorage.getItem('theme');

  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function writeTheme(theme: ThemeName, save: boolean) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
  currentTheme = theme;

  if (save) {
    window.localStorage.setItem('theme', theme);
  }

  for (const listener of listeners) {
    listener();
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    writeTheme(readTheme(), false);
  }, []);

  const isDark = theme === 'dark';

  function toggleTheme() {
    const nextTheme = isDark ? 'light' : 'dark';

    writeTheme(nextTheme, true);
  }

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      aria-label="Toggle color scheme"
      onClick={toggleTheme}
      className="inline-flex items-stretch border border-border font-mono text-[10px] uppercase tracking-[0.15em]"
    >
      <span
        data-testid="theme-toggle-light"
        className={`px-2 py-1 ${
          !isDark
            ? 'bg-foreground text-background'
            : 'bg-transparent text-muted-foreground'
        }`}
      >
        Light
      </span>
      <span
        data-testid="theme-toggle-dark"
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
