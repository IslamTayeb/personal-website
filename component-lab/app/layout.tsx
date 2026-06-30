import type { Metadata } from 'next';
import {
  Atkinson_Hyperlegible,
  Cabin,
  DM_Mono,
  Fira_Sans,
  Geist_Mono,
  IBM_Plex_Mono,
  Lato,
  Noto_Sans,
  Nunito_Sans,
  Open_Sans,
  Roboto_Mono,
  Source_Sans_3,
  Work_Sans,
} from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const atkinson = Atkinson_Hyperlegible({
  variable: '--font-atkinson',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const cabin = Cabin({
  variable: '--font-cabin',
  subsets: ['latin'],
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
});

const firaSans = Fira_Sans({
  variable: '--font-fira-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
});

const lato = Lato({
  variable: '--font-lato',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
});

const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans-3',
  subsets: ['latin'],
});

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Component Lab',
  description: 'Local visual exploration for islamtayeb.dev components.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${atkinson.variable} ${cabin.variable} ${dmMono.variable} ${firaSans.variable} ${geistMono.variable} ${ibmPlexMono.variable} ${lato.variable} ${notoSans.variable} ${nunitoSans.variable} ${openSans.variable} ${robotoMono.variable} ${sourceSans3.variable} ${workSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
