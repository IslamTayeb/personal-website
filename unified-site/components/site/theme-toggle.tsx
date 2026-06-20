'use client';

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
      className="inline-flex items-stretch border border-border font-mono text-[10px] uppercase tracking-[0.15em]"
    >
      <span
        data-testid="theme-toggle-light"
        className="bg-foreground px-2 py-1 text-background dark:bg-transparent dark:text-muted-foreground"
      >
        Light
      </span>
      <span
        data-testid="theme-toggle-dark"
        className="border-l border-border bg-transparent px-2 py-1 text-muted-foreground dark:bg-foreground dark:text-background"
      >
        Dark
      </span>
    </button>
  );
}
