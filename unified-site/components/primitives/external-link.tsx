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
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & {
  href: string;
  children: ReactNode;
  className?: string;
  section?: 'r' | 'o' | 'y' | 'b';
}) {
  const external = isExternalHref(href);
  const classes = cn(
    'royb-link royb-link-highlight',
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
