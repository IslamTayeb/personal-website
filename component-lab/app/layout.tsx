import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Space_Grotesk,
  Space_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Hanken_Grotesk,
  Schibsted_Grotesk,
  Sora,
  Bricolage_Grotesque,
  DM_Mono,
  Spline_Sans_Mono,
  Martian_Mono,
  Fragment_Mono,
} from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  subsets: ['latin'],
});

// Font candidates for the specimen lab
const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
});
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});
const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
});
const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});
// Additional sans candidates
const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken-grotesk',
  subsets: ['latin'],
});
const schibstedGrotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
});
const sora = Sora({ variable: '--font-sora', subsets: ['latin'] });
const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
});
// Additional mono candidates
const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
});
const splineSansMono = Spline_Sans_Mono({
  variable: '--font-spline-sans-mono',
  subsets: ['latin'],
});
const martianMono = Martian_Mono({
  variable: '--font-martian-mono',
  subsets: ['latin'],
});
const fragmentMono = Fragment_Mono({
  variable: '--font-fragment-mono',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Component Lab — Islam Tayeb',
  description:
    'A typed-document component lab for islamtayeb.dev + APM Overflow',
  generator: 'v0.app',
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
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${interTight.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${hankenGrotesk.variable} ${schibstedGrotesk.variable} ${sora.variable} ${bricolage.variable} ${dmMono.variable} ${splineSansMono.variable} ${martianMono.variable} ${fragmentMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
