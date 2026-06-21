import { ExternalLink } from '@/components/primitives/external-link';
import { footerQuote } from '@/data/links';

export function SiteFooter() {
  return (
    <footer
      data-testid="site-footer"
      className="mt-auto flex min-h-[47px] items-center justify-between gap-4 border-t border-border py-2.5 font-mono text-sm text-muted-foreground"
    >
      <span>Last updated Jun 21, 2026</span>
      <span>
        {'"'}
        <ExternalLink
          href={footerQuote.href}
          section="b"
          className="text-muted-foreground"
        >
          {footerQuote.label}
        </ExternalLink>
        {'"'} ~
        <ExternalLink
          href={footerQuote.creditHref}
          section="b"
          className="text-muted-foreground"
        >
          {footerQuote.credit}
        </ExternalLink>
      </span>
    </footer>
  );
}
