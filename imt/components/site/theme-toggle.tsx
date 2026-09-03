'use client';

import { RoybLinkText } from '@/components/primitives/royb-link';

type ThemeName = 'light' | 'dark';

type HarmoniaThemeWindow = Window & {
  __syncHarmoniaIframes?: () => void;
};

function applyTheme(theme: ThemeName) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem('theme', theme);
  (window as HarmoniaThemeWindow).__syncHarmoniaIframes?.();
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
      className="royb-link-plain section-color-n royb-link-hover-scope font-mono text-base text-[#6B6966] outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <span className="dark:hidden">
        <RoybLinkText section="n">light</RoybLinkText>
      </span>
      <span className="hidden dark:inline">
        <RoybLinkText section="n">dark</RoybLinkText>
      </span>
    </button>
  );
}
