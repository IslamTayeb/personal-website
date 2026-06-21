import { cn } from '@/lib/utils';

export function RoybBand({ className }: { className?: string }) {
  return (
    <div data-testid="royb-band-wrap" className={cn('py-2', className)}>
      <div
        className="royb-band h-1 w-full"
        data-testid="royb-band"
        aria-hidden="true"
      />
    </div>
  );
}
