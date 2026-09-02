import { Wordmark } from '@/components/primitives/wordmark';
import { ThemeToggle } from '@/components/site/theme-toggle';

export function SiteHeader() {
  return (
    <header
      data-testid="site-header"
      className="border-b border-border bg-background py-3"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Wordmark />
        <ThemeToggle />
      </div>
    </header>
  );
}
