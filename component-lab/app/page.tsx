import { FontsSection } from '@/components/lab/fonts';
import { WordmarkSection } from '@/components/lab/wordmark';
import { HeroSection } from '@/components/lab/hero';
import { ExperienceSection } from '@/components/lab/experience';
import { ProjectsSection } from '@/components/lab/projects';
import { WritingSection } from '@/components/lab/writing';
import { AccentSection } from '@/components/lab/accent';
import { ThemeToggle } from '@/components/lab/theme-toggle';
import { MoonGlyph, SquaredPlusGlyph } from '@/components/lab/glyphs';

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 md:px-8">
      {/* sticky nav */}
      <nav className="sticky top-0 z-50 -mx-5 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur md:-mx-8 md:px-8">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground">
          <MoonGlyph size={13} />
          <span className="text-muted-foreground">/</span>
          <SquaredPlusGlyph size={12} />
          <span className="ml-1">Component Lab</span>
        </span>
        <ThemeToggle />
      </nav>

      {/* masthead */}
      <header className="flex flex-col gap-6 py-16 md:py-24">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Islam Tayeb
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            v.06 — 2026
          </span>
        </div>
        <div className="royb-band h-1 w-full" />
        <h1 className="max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-foreground text-balance md:text-3xl">
          A typed-document lab for{' '}
          <span className="text-roy-r">islamtayeb.dev</span> and{' '}
          <span className="text-roy-b">APM Overflow</span>.
        </h1>
        <p className="max-w-2xl text-sm font-normal leading-relaxed text-foreground/80 text-pretty">
          Sharp corners, monochrome paper, mono metadata. v.06 adds §04 Projects
          (fancy cards from your site plus simpler treatments), rebuilds Writing
          as a continuous rail to match Experience, and drops the grey panels in
          Typeface. Finals are tagged. Everything instant, nothing soft.
        </p>
      </header>

      <FontsSection />
      <WordmarkSection />
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <WritingSection />
      <AccentSection />

      <footer className="flex items-center justify-between border-t border-border py-10 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <MoonGlyph size={12} /> islamtayeb.dev
        </span>
        <span className="flex items-center gap-2 text-foreground">
          <SquaredPlusGlyph size={11} /> apm overflow
        </span>
      </footer>
    </main>
  );
}
