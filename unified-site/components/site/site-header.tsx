import { Wordmark } from '@/components/primitives/wordmark';
import { ThemeToggle } from '@/components/site/theme-toggle';

export function SiteHeader() {
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 -mx-4 border-b border-border bg-background/95 px-4 py-2.5"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Wordmark />
        <ThemeToggle />
      </div>
    </header>
  );
}
