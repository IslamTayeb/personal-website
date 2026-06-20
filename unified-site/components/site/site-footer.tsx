import { MoonGlyph, SparkleGlyph } from '@/components/primitives/glyphs';

export function SiteFooter() {
  return (
    <footer className="flex items-center justify-between border-t border-border py-7 font-mono text-xs text-muted-foreground">
      <span className="flex items-center gap-2">
        <MoonGlyph size={12} /> islamtayeb.dev
      </span>
      <span className="flex items-center gap-2 text-foreground">
        <SparkleGlyph size={11} /> blog
      </span>
    </footer>
  );
}
