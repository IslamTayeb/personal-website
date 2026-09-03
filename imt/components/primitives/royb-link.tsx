import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type RoybSection = 'r' | 'o' | 'y' | 'b' | 'n';
export type RoybLinkVariant = 'highlight' | 'plain';

export function roybLinkClassName({
  section = 'b',
  variant = 'highlight',
  external = false,
  className,
}: {
  section?: RoybSection;
  variant?: RoybLinkVariant;
  external?: boolean;
  className?: string;
}) {
  return cn(
    variant === 'highlight'
      ? 'royb-link royb-link-highlight royb-link-fragment'
      : 'royb-link-plain',
    `section-color-${section}`,
    external && 'external-link',
    className
  );
}

export function RoybLinkText({
  children,
  className,
  section = 'b',
  variant = 'highlight',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  className?: string;
  section?: RoybSection;
  variant?: RoybLinkVariant;
}) {
  return (
    <span
      {...props}
      className={roybLinkClassName({ section, variant, className })}
    >
      {children}
    </span>
  );
}
