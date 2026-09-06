import { cn } from '@/lib/utils';

// Sits flush under the site header and bleeds across the page's 20px
// gutters so it spans the sheet (desktop) or the screen (mobile). Only the
// top/bottom ink rules remain; the side rules would double the page frame.
// 12px above (header py-3), 16px below before the first section.
export function RoybBand({ className }: { className?: string }) {
  return (
    <div data-testid="royb-band-wrap" className={cn('-mx-5 pb-4', className)}>
      <div
        className="royb-band h-[9px] w-full border-y border-[var(--page-rule)]"
        data-testid="royb-band"
        aria-hidden="true"
      />
    </div>
  );
}
