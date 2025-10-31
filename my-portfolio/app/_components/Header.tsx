import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';
import { Icon } from '@iconify/react/dist/iconify.js';
export const Header = () => {
  const email = 'islam.tayeb@duke.edu';

  return (
    <header className="sticky top-0 py-3 z-50 bg-card bg-clip-padding bg-opacity-80 h-12 border-b border-dashed">
      <div className="flex max-w-3xl m-auto px-4">
        <h1 className="text-lg font-normal text-primary leading-none my-auto">
          <Link href="#hero" className="leading-none">
            (Islam M)<sup className="ml-0.5">2</sup> Tayeb
          </Link>
        </h1>
        <div className="flex-1" />
        <ul className="flex gap-2">
          <Link
            href="https://apmoverflow.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'border-dashed p-0 flex items-center justify-center h-6 group hover:bg-muted transition-colors'
            )}
          >
            <span className="flex items-center justify-center px-1 py-0">
              <span className="text-foreground text-[18px] font-medium w-4 p-0 h-4 flex items-center justify-center leading-none mt-[0.1em]">⌘</span>
              <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden ml-[0.35em] underline group-hover:no-underline">
                Blog
              </p>
            </span>
          </Link>
          <Link
            href={`mailto:${email}`}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'border-dashed p-0 flex items-center justify-center h-6 group hover:bg-muted transition-colors'
            )}
            title="Send email"
          >
            <span className="flex items-center justify-center px-1 py-0">
              <Mail size={12} className="text-foreground -mt-[0.1em]" />
              <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden ml-[0.35em] underline group-hover:no-underline">
                Email
              </p>
            </span>
          </Link>
        </ul>
      </div>
    </header>
  );
};
