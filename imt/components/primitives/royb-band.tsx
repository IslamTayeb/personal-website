import { cn } from '@/lib/utils';

// Sits flush under the site header and bleeds across the page's 20px
// gutters so it spans the sheet (desktop) or the screen (mobile). Only the
// top/bottom ink rules remain; the side rules would double the page frame.
// The 12px below matches the header's 12px above.
export function RoybBand({ className }: { className?: string }) {
  return (
    <div data-testid="royb-band-wrap" className={cn('-mx-5 pb-3', className)}>
      <div
        className="royb-band h-[9px] w-full border-y border-[var(--page-rule)]"
        data-testid="royb-band"
        aria-hidden="true"
      />
    </div>
  );
}
