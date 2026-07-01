import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

type TagTone = 'neutral' | 'r' | 'o' | 'y' | 'b';

const tagToneClasses: Record<TagTone, string> = {
  neutral:
    'border-[var(--tag-rule)] bg-[var(--tag-background)] text-foreground',
  r: 'border-roy-r bg-roy-r/[0.14] text-foreground',
  o: 'border-roy-o bg-roy-o/[0.16] text-foreground',
  y: 'border-roy-y bg-roy-y/[0.22] text-foreground',
  b: 'border-roy-b bg-roy-b/[0.14] text-foreground',
};

export function Tag({
  tone = 'neutral',
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'span'> & {
  tone?: TagTone;
}) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center border border-dotted px-1.5 py-0.5 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em]',
        tagToneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
