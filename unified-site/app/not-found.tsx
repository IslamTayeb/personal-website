import Link from 'next/link';

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
        The page does not exist in this unified prototype.
      </p>
      <Link
        href="/"
        className="mt-5 inline-block font-mono text-xs uppercase tracking-[0.14em] underline underline-offset-4"
      >
        Back home
      </Link>
    </div>
  );
}
