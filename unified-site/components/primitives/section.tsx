import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Section({
  id,
  index,
  title,
  accent = 'text-roy-o',
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  accent?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      // Section dividers are intentionally disabled for this visual pass.
      // Keep the same vertical padding so the spacing stays comparable.
      className={cn('py-3 md:py-3.5', className)}
    >
      <header className="mb-3 flex flex-col gap-1">
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline">
          <span className={cn('font-mono text-xs', accent)}>§{index}</span>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
            {title}
          </h2>
        </div>
      </header>
      {children}
    </section>
  );
}

export function BorderedPanel({ children }: { children: ReactNode }) {
  return (
    <div data-testid="bordered-panel" className="bg-background p-0">
      {children}
    </div>
  );
}
