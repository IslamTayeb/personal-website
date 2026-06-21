'use client';

import { Moon, Sun } from 'lucide-react';

type ThemeName = 'light' | 'dark';

function applyTheme(theme: ThemeName) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem('theme', theme);
}

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains('dark')
      ? 'light'
      : 'dark';

    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      aria-label="Toggle color scheme"
      onClick={toggleTheme}
      className="inline-flex items-stretch border border-border text-muted-foreground outline-none hover:border-muted-foreground/70 active:bg-muted focus-visible:ring-1 focus-visible:ring-ring"
    >
      <span
        data-testid="theme-toggle-light"
        className="grid h-6 w-7 place-items-center bg-foreground text-background hover:bg-foreground/85 active:bg-foreground/75 dark:bg-transparent dark:text-muted-foreground dark:hover:bg-muted dark:active:bg-muted/70"
      >
        <Sun size={12} strokeWidth={1.8} aria-hidden />
      </span>
      <span
        data-testid="theme-toggle-dark"
        className="grid h-6 w-7 place-items-center border-l border-border bg-transparent text-muted-foreground hover:bg-muted active:bg-muted/70 dark:bg-foreground dark:text-background dark:hover:bg-foreground/85 dark:active:bg-foreground/75"
      >
        <Moon size={12} strokeWidth={1.8} aria-hidden />
      </span>
    </button>
  );
}
