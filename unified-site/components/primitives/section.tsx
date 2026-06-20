import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Section({
  id,
  index,
  title,
  note,
  accent = 'text-roy-o',
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  note?: string;
  accent?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn('border-t border-border py-6 md:py-7', className)}
    >
      <header className="mb-4 flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <span className={cn('font-mono text-xs', accent)}>§{index}</span>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
            {title}
          </h2>
        </div>
        {note ? (
          <p className="max-w-2xl pl-9 text-sm leading-snug text-muted-foreground text-pretty">
            {note}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function BorderedPanel({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="bordered-panel"
      className="border border-border bg-background p-3"
    >
      {children}
    </div>
  );
}
