import type { ReactNode } from 'react';
import { ExternalLink } from '@/components/primitives/external-link';
import { cn } from '@/lib/utils';

const actionClassName =
  'font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/75';

export function SectionActionLink({
  href,
  section,
  children,
  className,
}: {
  href: string;
  section: 'r' | 'o' | 'y' | 'b';
  children: ReactNode;
  className?: string;
}) {
  return (
    <ExternalLink
      href={href}
      section={section}
      className={cn(actionClassName, className)}
    >
      {children}
    </ExternalLink>
  );
}

export function SectionActionButton({
  section,
  children,
  className,
  onClick,
  testId,
}: {
  section: 'r' | 'o' | 'y' | 'b';
  children: ReactNode;
  className?: string;
  onClick: () => void;
  testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={cn(
        'royb-link royb-link-highlight',
        `section-color-${section}`,
        actionClassName,
        'outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className
      )}
    >
      {children}
    </button>
  );
}
