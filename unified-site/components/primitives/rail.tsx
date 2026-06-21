import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type RailConnector = 'solid' | 'dashed' | 'none';

export function RailList({
  children,
  className,
  testId,
}: {
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <ul data-testid={testId} className={cn('flex w-full flex-col', className)}>
      {children}
    </ul>
  );
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
  metaClassName,
  descriptionClassName,
  incoming,
  state,
  testId,
  connectorTestId = 'rail-connector',
  dotTestId = 'rail-dot',
  titleTestId = 'rail-title',
  rowButtonTestId,
  onActivate,
  ariaExpanded,
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
  metaClassName?: string;
  descriptionClassName?: string;
  incoming?: boolean;
  state?: 'incoming' | 'present' | 'ended';
  testId?: string;
  connectorTestId?: string;
  dotTestId?: string;
  titleTestId?: string;
  rowButtonTestId?: string;
  onActivate?: () => void;
  ariaExpanded?: boolean;
}) {
  const topRow = (
    <>
      <span
        data-testid={titleTestId}
        className={cn(
          'min-w-0 text-base font-medium leading-tight text-foreground',
          titleClassName
        )}
      >
        {title}
      </span>
      {meta ? (
        <span
          className={cn(
            'shrink-0 font-mono text-sm text-muted-foreground',
            metaClassName
          )}
        >
          {meta}
        </span>
      ) : null}
    </>
  );

  return (
    <li
      data-testid={testId}
      className={cn(
        'relative grid grid-cols-[var(--rail-gutter)_minmax(0,1fr)] pb-1.5 last:pb-0',
        className
      )}
    >
      {connector !== 'none' ? (
        <span
          data-testid={connectorTestId}
          className={cn(
            'absolute left-[calc(var(--rail-marker-size)/2-0.5px)] top-[21px] bottom-[5px] w-px',
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
        data-testid={dotTestId}
        data-incoming={incoming ? 'true' : undefined}
        data-state={state}
        className={cn(
          'relative mt-1 h-[var(--rail-marker-size)] w-[var(--rail-marker-size)] shrink-0',
          dotClassName
        )}
      />
      <div className="flex w-full min-w-0 flex-col gap-1">
        {onActivate ? (
          <button
            type="button"
            onClick={onActivate}
            aria-expanded={ariaExpanded}
            data-testid={rowButtonTestId}
            className="flex w-full min-w-0 cursor-pointer items-start justify-between gap-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {topRow}
          </button>
        ) : (
          <div className="flex min-w-0 items-start justify-between gap-3">
            {topRow}
          </div>
        )}
        {description ? (
          <p
            data-one-line="true"
            className={cn(
              'truncate text-base leading-snug text-foreground',
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

export function RailActionItem({
  children,
  testId = 'rail-action-row',
  className,
}: {
  children: ReactNode;
  testId?: string;
  className?: string;
}) {
  return (
    <li
      data-testid={testId}
      className={cn(
        'relative grid grid-cols-[var(--rail-gutter)_minmax(0,1fr)] pt-1.5',
        className
      )}
    >
      <span aria-hidden />
      <div className="flex min-w-0 justify-end">{children}</div>
    </li>
  );
}
