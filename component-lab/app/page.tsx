import { WordmarkSection } from '@/components/lab/wordmark';
import { HeroSection } from '@/components/lab/hero';
import { LinksSection } from '@/components/lab/links';
import { ExperienceSection } from '@/components/lab/experience';
import { PublicationsSection } from '@/components/lab/publications';
import { CoursesSection } from '@/components/lab/courses';
import { WritingSection } from '@/components/lab/writing';
import { ArticlePrimitivesSection } from '@/components/lab/article-primitives';
import { PortraitDitherLabSection } from '@/components/lab/portrait-dither-lab';
import {
  ExperienceIconRailLabSection,
  ExperienceGroupingLabSection,
  LayoutRhythmLabSection,
  PublicationRhythmLabSection,
} from '@/components/lab/layout-prototypes';
import { ThemeToggle } from '@/components/lab/theme-toggle';
import { MoonGlyph, SparkleGlyph } from '@/components/lab/glyphs';

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4">
      {/* sticky nav */}
      <nav className="sticky top-0 z-50 -mx-4 flex items-center justify-between border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground">
          <MoonGlyph size={13} />
          <span className="text-muted-foreground">/</span>
          <SparkleGlyph size={12} />
          <span className="ml-1">Component Lab</span>
        </span>
        <ThemeToggle />
      </nav>

      {/* masthead */}
      <header className="flex flex-col gap-4 py-10 md:py-12">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Islam Tayeb
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            v.11 — 2026
          </span>
        </div>
        <div className="royb-band h-1 w-full" />
        <h1 className="max-w-2xl text-xl font-semibold leading-snug tracking-tight text-foreground text-balance md:text-2xl">
          A typed-document lab for{' '}
          <span className="text-roy-r">islamtayeb.dev</span> and{' '}
          <span className="text-roy-b">APM Overflow</span>.
        </h1>
        <p className="max-w-2xl text-sm font-normal leading-relaxed text-foreground/80 text-pretty">
          Sharp corners, monochrome paper, mono metadata. v.11 adds the copied
          experience icon rail so row anatomy can be compared before porting.
        </p>
      </header>

      <WordmarkSection />
      <HeroSection />
      <PortraitDitherLabSection />
      <LinksSection />
      <ExperienceSection />
      <PublicationsSection />
      <CoursesSection />
      <WritingSection />
      <ArticlePrimitivesSection />
      <ExperienceGroupingLabSection />
      <PublicationRhythmLabSection />
      <LayoutRhythmLabSection />
      <ExperienceIconRailLabSection />

      <footer className="flex items-center justify-between border-t border-border py-7 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <MoonGlyph size={12} /> islamtayeb.dev
        </span>
        <span className="flex items-center gap-2 text-foreground">
          <SparkleGlyph size={11} /> apm overflow
        </span>
      </footer>
    </main>
  );
}
