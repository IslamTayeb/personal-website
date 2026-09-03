import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RailConnector = 'solid' | 'dashed' | 'none';
type RailAccent = 'r' | 'o' | 'y' | 'b';

const railAccentClasses: Record<RailAccent, string> = {
  r: 'rail-link-hover-accent-r',
  o: 'rail-link-hover-accent-o',
  y: 'rail-link-hover-accent-y',
  b: 'rail-link-hover-accent-b',
};

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
  marker,
  markerHeight,
  title,
  meta,
  description,
  connector = 'solid',
  connectorClassName,
  hoverAccent,
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
  // Optional mark rendered centered on the dot's position instead of the
  // plain square. It may be wider or taller than the dot and overhangs evenly.
  marker?: ReactNode;
  // Rendered height of `marker` in px. The connector uses it to keep the same
  // air around the mark that the plain 12px dot gets (5px below, 9px above).
  markerHeight?: number;
  title: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  connector?: RailConnector;
  connectorClassName?: string;
  hoverAccent?: RailAccent;
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
  const topRowClassName = cn(
    'grid min-w-0 items-start gap-3 text-left',
    meta ? 'grid-cols-[minmax(0,1fr)_auto]' : 'grid-cols-[minmax(0,1fr)]'
  );
  const hoverAccentClasses = hoverAccent
    ? railAccentClasses[hoverAccent]
    : undefined;
  const topRow = (
    <>
      <span
        data-testid={titleTestId}
        className={cn(
          'min-w-0 text-base font-semibold leading-tight text-foreground',
          titleClassName
        )}
      >
        {title}
      </span>
      {meta ? (
        <span
          className={cn(
            'min-w-[5.5rem] max-w-[min(48vw,13rem)] whitespace-normal text-right font-mono text-sm leading-tight text-muted-foreground site-desktop:min-w-0 site-desktop:max-w-none site-desktop:shrink-0 site-desktop:whitespace-nowrap',
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
      style={
        marker && markerHeight
          ? ({ '--rail-mark-height': `${markerHeight}px` } as CSSProperties)
          : undefined
      }
      className={cn(
        'relative grid grid-cols-[var(--rail-gutter)_minmax(0,1fr)] pb-2 last:pb-0',
        hoverAccentClasses,
        className
      )}
    >
      {connector !== 'none' ? (
        <span
          data-testid={connectorTestId}
          className={cn(
            'absolute w-px',
            // The plain dot spans 4px to 16px of the row; the line starts 5px
            // under it and stops 9px above the next dot. A mark is centered on
            // the same 10px midline, so the same gaps follow from its height.
            // A 1px line centered on the 12px box also lands on a half pixel
            // and snaps left, so under a mark it starts on the center pixel.
            marker && markerHeight
              ? 'left-[calc(var(--rail-marker-size)/2)] top-[calc(15px+var(--rail-mark-height)/2)] bottom-[calc(var(--rail-mark-height)/2-1px)]'
              : 'left-[calc(var(--rail-marker-size)/2-0.5px)] top-[21px] bottom-[5px]',
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
        data-rail-hover-target={hoverAccent ? 'true' : undefined}
        data-rail-marker={marker ? 'true' : undefined}
        data-incoming={incoming ? 'true' : undefined}
        data-state={state}
        className={cn(
          'relative mt-1 h-[var(--rail-marker-size)] w-[var(--rail-marker-size)] shrink-0',
          marker && 'flex items-center justify-center',
          dotClassName
        )}
      >
        {marker}
      </span>
      <div className="flex w-full min-w-0 flex-col gap-0.5">
        {onActivate ? (
          <button
            type="button"
            onClick={onActivate}
            aria-expanded={ariaExpanded}
            data-testid={rowButtonTestId}
            className={cn(
              topRowClassName,
              'w-full cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring'
            )}
          >
            {topRow}
          </button>
        ) : (
          <div className={topRowClassName}>{topRow}</div>
        )}
        {description ? (
          <p
            data-one-line="true"
            className={cn(
              'reading-copy text-base leading-snug text-foreground site-desktop:truncate',
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
        'relative grid grid-cols-[var(--rail-gutter)_minmax(0,1fr)]',
        className
      )}
    >
      <span aria-hidden />
      <div className="flex min-w-0 justify-start">{children}</div>
    </li>
  );
}
