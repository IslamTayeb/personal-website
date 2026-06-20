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
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${dmMono.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <main className="mx-auto min-h-screen max-w-3xl px-4">
          <SiteHeader />
          {children}
          <SiteFooter />
        </main>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
