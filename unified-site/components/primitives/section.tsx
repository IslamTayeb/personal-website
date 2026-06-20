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
      className={cn('border-t border-border py-6 md:py-7', className)}
    >
      <header className="mb-3 flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
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
