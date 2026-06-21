import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Section({
  id,
  index,
  title,
  accent = 'text-roy-o',
  headerExtra,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  accent?: string;
  headerExtra?: ReactNode;
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
      <SectionHeader
        index={index}
        title={title}
        accent={accent}
        extra={headerExtra}
      />
      {children}
    </section>
  );
}

export function SectionHeader({
  index,
  title,
  accent = 'text-roy-o',
  extra,
}: {
  index: string;
  title: string;
  accent?: string;
  extra?: ReactNode;
}) {
  return (
    <header className="mb-3 flex flex-col gap-1">
      <div
        className={cn(
          'grid items-baseline',
          extra
            ? 'grid-cols-[var(--rail-gutter)_minmax(0,1fr)_auto]'
            : 'grid-cols-[var(--rail-gutter)_minmax(0,1fr)]'
        )}
      >
        <span className={cn('w-fit font-mono text-xs', accent)}>§{index}</span>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
          {title}
        </h2>
        {extra ? <div className="min-w-0 self-center">{extra}</div> : null}
      </div>
    </header>
  );
}

export function BorderedPanel({ children }: { children: ReactNode }) {
  return (
    <div data-testid="bordered-panel" className="bg-background p-0">
      {children}
    </div>
  );
}
