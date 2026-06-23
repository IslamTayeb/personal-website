import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeadingLevel = 'h1' | 'h2';

export function Section({
  id,
  index,
  title,
  accent = 'text-roy-o',
  headingLevel = 'h2',
  headerExtra,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  accent?: string;
  headingLevel?: SectionHeadingLevel;
  headerExtra?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      // Adjacent section boxes touch; paired 16px paddings create a 32px gap.
      className={cn('py-4', className)}
    >
      <SectionHeader
        index={index}
        title={title}
        accent={accent}
        headingLevel={headingLevel}
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
  headingLevel = 'h2',
  extra,
}: {
  index: string;
  title: string;
  accent?: string;
  headingLevel?: SectionHeadingLevel;
  extra?: ReactNode;
}) {
  const Heading = headingLevel;

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
        <span
          className={cn('inline-block w-[14px] font-mono text-base', accent)}
        >
          §{index}
        </span>
        <Heading
          className={cn(
            'font-mono text-base uppercase tracking-[0.2em]',
            accent
          )}
        >
          {title}
        </Heading>
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
