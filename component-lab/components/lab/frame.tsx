import type { ReactNode } from 'react';

export function Section({
  index,
  title,
  note,
  accent = 'text-roy-o',
  cols = 3,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  accent?: string;
  cols?: 1 | 2 | 3;
  children: ReactNode;
}) {
  const colsClass =
    cols === 1 ? '' : cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <section className="border-t border-border py-12 md:py-16">
      <header className="mb-8 flex flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <span className={`font-mono text-xs ${accent}`}>§{index}</span>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
            {title}
          </h2>
        </div>
        {note ? (
          <p className="max-w-2xl pl-9 text-sm leading-relaxed text-muted-foreground text-pretty">
            {note}
          </p>
        ) : null}
      </header>
      <div
        className={
          cols === 1 ? 'flex flex-col' : `grid gap-px bg-border ${colsClass}`
        }
      >
        {children}
      </div>
    </section>
  );
}

export function Variant({
  label,
  tag,
  children,
}: {
  label: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
        {tag ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-roy-r">
            {tag}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 items-center p-6">{children}</div>
    </div>
  );
}
