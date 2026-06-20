import Link from 'next/link';
import { navItems } from '@/data/navigation';
import { Wordmark } from '@/components/primitives/wordmark';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 -mx-4 border-b border-border bg-background/95 px-4 py-2.5">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Wordmark />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
