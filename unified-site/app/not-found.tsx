import { ExternalLink } from '@/components/primitives/external-link';

export default function NotFound() {
  return (
    <div className="border-t border-border py-16">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-xl font-semibold tracking-tight">
        Nothing here.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This page does not exist.
      </p>
      <ExternalLink
        href="/"
        section="b"
        className="mt-5 font-mono text-xs uppercase tracking-[0.14em]"
      >
        Back home
      </ExternalLink>
    </div>
  );
}
