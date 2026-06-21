import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function ExternalLink({
  href,
  children,
  className,
  section = 'b',
  variant = 'highlight',
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
  href: string;
  children: ReactNode;
  className?: string;
  section?: 'r' | 'o' | 'y' | 'b';
  variant?: 'highlight' | 'plain';
}) {
  const external = isExternalHref(href);
  const classes = cn(
    variant === 'highlight'
      ? 'royb-link royb-link-highlight'
      : 'royb-link-plain',
    `section-color-${section}`,
    external && 'external-link',
    className
  );

  if (external) {
    return (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noreferrer external"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
