'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
      <Link
        href="/"
        className={cn(
          'flex items-center gap-2',
          active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
        )}
      >
        <MoonGlyph size={14} /> islam
      </Link>
      <span
        aria-hidden
        className="text-[#DFDEDB] dark:text-muted-foreground/45"
      >
        /
      </span>
      <Link
        href="/blog"
        className={cn(
          'flex items-center gap-2',
          active === 'blog' ? 'text-roy-b' : 'text-muted-foreground'
        )}
      >
        <SparkleGlyph size={13} /> blog
      </Link>
    </div>
  );
}
