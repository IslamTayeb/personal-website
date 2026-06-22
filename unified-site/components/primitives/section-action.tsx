import type { ReactNode } from 'react';
import { ExternalLink } from '@/components/primitives/external-link';
import {
  roybLinkClassName,
  type RoybSection,
} from '@/components/primitives/royb-link';
import { cn } from '@/lib/utils';

const actionClassName = 'font-mono text-sm text-muted-foreground';

export function SectionActionLink({
  href,
  section,
  children,
  className,
}: {
  href: string;
  section: RoybSection;
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
  section: RoybSection;
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
        roybLinkClassName({ section }),
        actionClassName,
        'outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className
      )}
    >
      {children}
    </button>
  );
}
