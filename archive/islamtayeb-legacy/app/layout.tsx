import type { Metadata } from 'next';
import { Anek_Telugu } from 'next/font/google';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import VisitorTracker from './_components/VisitorTracker';

const anekTelugu = Anek_Telugu({
  subsets: ['latin'],
  variable: '--font-caption',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'Islam Tayeb',
  description: "Islam Tayeb's Portfolio",
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/favicon.ico?v=4'],
  },
  openGraph: {
    title: 'Islam Tayeb',
    description: "Islam Tayeb's Portfolio",
    url: '/',
    siteName: 'Islam Tayeb',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Islam Tayeb',
    description: "Islam Tayeb's Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-card">
      <body
        className={cn(
          GeistMono.variable,
          GeistSans.variable,
          anekTelugu.variable,
          'font-mono h-full bg-background text-foreground'
        )}
      >
        {children}
        <SpeedInsights />
        <Analytics />
        <VisitorTracker />
        <Toaster />
      </body>
    </html>
  );
}
