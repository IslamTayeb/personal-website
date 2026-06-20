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
      className="inline-flex items-stretch border border-border text-muted-foreground"
    >
      <span
        data-testid="theme-toggle-light"
        className="grid h-6 w-7 place-items-center bg-foreground text-background dark:bg-transparent dark:text-muted-foreground"
      >
        <Sun size={12} strokeWidth={1.8} aria-hidden />
      </span>
      <span
        data-testid="theme-toggle-dark"
        className="grid h-6 w-7 place-items-center border-l border-border bg-transparent text-muted-foreground dark:bg-foreground dark:text-background"
      >
        <Moon size={12} strokeWidth={1.8} aria-hidden />
      </span>
    </button>
  );
}
