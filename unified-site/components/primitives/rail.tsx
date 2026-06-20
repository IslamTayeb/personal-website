import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type RailConnector = 'solid' | 'dashed' | 'none';

export function RailList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <ul className={cn('flex w-full flex-col', className)}>{children}</ul>;
}

export function RailItem({
  dotClassName,
  title,
  meta,
  description,
  connector = 'solid',
  connectorClassName,
  footer,
  className,
  titleClassName,
  descriptionClassName,
}: {
  dotClassName: string;
  title: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  connector?: RailConnector;
  connectorClassName?: string;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <li className={cn('relative flex gap-3 pb-1.5 last:pb-0', className)}>
      {connector !== 'none' ? (
        <span
          data-testid="rail-connector"
          className={cn(
            'absolute left-[3.5px] top-[19px] bottom-[5px] w-px',
            connector === 'solid' ? 'bg-border' : 'text-border',
            connectorClassName
          )}
          style={
            connector === 'dashed'
              ? {
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 9px)',
                }
              : undefined
          }
        />
      ) : null}
      <span
        data-testid="rail-dot"
        className={cn('relative mt-1 h-2 w-2 shrink-0', dotClassName)}
      />
      <div className="flex w-full min-w-0 flex-col gap-1">
        <div className="flex min-w-0 items-baseline justify-between gap-3">
          <span
            data-testid="rail-title"
            className={cn(
              'min-w-0 text-sm leading-tight text-foreground',
              titleClassName
            )}
          >
            {title}
          </span>
          {meta ? (
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {meta}
            </span>
          ) : null}
        </div>
        {description ? (
          <p
            className={cn(
              'text-xs leading-snug text-muted-foreground text-pretty md:whitespace-nowrap',
              descriptionClassName
            )}
          >
            {description}
          </p>
        ) : null}
        {footer ? <div>{footer}</div> : null}
      </div>
    </li>
  );
}
