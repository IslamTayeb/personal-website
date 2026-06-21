import { footerQuote } from '@/data/links';
import { cn } from '@/lib/utils';

function isHttpHref(href: string) {
  return /^https?:\/\//.test(href);
}

function FooterAnchor({
  href,
  children,
  className,
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const http = isHttpHref(href);

  return (
    <a
      href={href}
      target={http ? '_blank' : undefined}
      rel={http ? 'noreferrer external' : undefined}
      className={cn(
        'royb-link royb-link-highlight section-color-b external-link',
        className
      )}
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer
      data-testid="site-footer"
      // Footer divider is disabled with the section dividers for this pass.
      className="flex min-h-[47px] items-center py-2.5 font-mono text-xs text-muted-foreground"
    >
      <span>
        {'"'}
        <FooterAnchor href={footerQuote.href} className="text-muted-foreground">
          {footerQuote.label}
        </FooterAnchor>
        {'"'} ~
        <FooterAnchor
          href={footerQuote.creditHref}
          className="text-muted-foreground"
        >
          {footerQuote.credit}
        </FooterAnchor>
      </span>
    </footer>
  );
}
