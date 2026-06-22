import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { DM_Mono, Sora } from 'next/font/google';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import './globals.css';

const sora = Sora({ variable: '--font-sora', subsets: ['latin'] });
const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://islamtayeb.dev'),
  title: {
    default: 'Islam Tayeb',
    template: '%s | Islam Tayeb',
  },
  description:
    'Islam Tayeb: systems, ML tooling, research, and APM Overflow writing.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const themeInitScript = `
(function () {
  function currentTheme() {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  }

  function themedHarmoniaSrc(src, theme) {
    try {
      var url = new URL(src, window.location.href);
      url.searchParams.set('theme', theme);
      return url.href;
    } catch (_) {
      return src;
    }
  }

  function syncHarmoniaIframes() {
    var theme = currentTheme();
    document
      .querySelectorAll('iframe[data-harmonia-iframe="true"]')
      .forEach(function (iframe) {
        var baseSrc = iframe.getAttribute('data-harmonia-src');

        if (!baseSrc) {
          return;
        }

        var nextSrc = themedHarmoniaSrc(baseSrc, theme);

        if (iframe.getAttribute('src') !== nextSrc) {
          iframe.setAttribute('src', nextSrc);
        }

        if (iframe.getAttribute('data-harmonia-theme') !== theme) {
          iframe.setAttribute('data-harmonia-theme', theme);
        }
      });
  }

  try {
    var saved = window.localStorage.getItem('theme');
    var theme =
      saved === 'light' || saved === 'dark'
        ? saved
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  }

  window.__syncHarmoniaIframes = syncHarmoniaIframes;

  if (window.MutationObserver && document.body) {
    new MutationObserver(syncHarmoniaIframes).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncHarmoniaIframes);
  } else {
    syncHarmoniaIframes();
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${dmMono.variable} bg-background`}
    >
      <body className="bg-background font-sans text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-4">
          <SiteHeader />
          {children}
          <SiteFooter />
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
