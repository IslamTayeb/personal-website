'use client';

import { usePathname } from 'next/navigation';
import { ExternalLink } from '@/components/primitives/external-link';
import { cn } from '@/lib/utils';
import { MoonGlyph, SparkleGlyph } from './glyphs';

export function Wordmark() {
  const pathname = usePathname();
  const active = pathname.startsWith('/blog') ? 'blog' : 'islam';

  return (
    <div
      className="flex items-center gap-4 font-mono text-sm"
      aria-label="Site surfaces"
      data-testid="wordmark"
    >
      <ExternalLink
        href="/"
        section="r"
        variant="plain"
        className={cn(
          'flex items-center gap-2',
          active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
        )}
      >
        <MoonGlyph size={14} /> islam
      </ExternalLink>
      <span
        aria-hidden
        className="text-[#DFDEDB] dark:text-muted-foreground/45"
      >
        /
      </span>
      <ExternalLink
        href="/blog"
        section="b"
        variant="plain"
        className={cn(
          'flex items-center gap-2',
          active === 'blog' ? 'text-roy-b' : 'text-muted-foreground'
        )}
      >
        <SparkleGlyph size={13} /> blog
      </ExternalLink>
    </div>
  );
}
