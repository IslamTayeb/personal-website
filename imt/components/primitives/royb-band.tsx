import { cn } from '@/lib/utils';

export function RoybBand({ className }: { className?: string }) {
  return (
    <div data-testid="royb-band-wrap" className={cn('py-5', className)}>
      <div
        className="royb-band h-[9px] w-full border border-[var(--page-rule)]"
        data-testid="royb-band"
        aria-hidden="true"
      />
    </div>
  );
}
