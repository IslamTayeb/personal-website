import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DefaultIcon } from './sharedComponents';
export const Header = () => {
  const email = 'islam.tayeb@duke.edu';

  return (
    <header className="sticky top-0 py-3 z-50 bg-card bg-clip-padding bg-opacity-80 h-12 border-b border-dashed">
      <div className="flex max-w-3xl m-auto px-4">
        <h1 className="text-lg font-normal text-primary leading-none my-auto">
            (Islam M)<sup>2</sup> Tayeb
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
              <DefaultIcon icon="lucide:command" className="inline text-current mt-0" />
              <p className="text-foreground m-0 leading-none inline max-sm:hidden underline group-hover:no-underline ml-[0.4em]">
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
              <DefaultIcon icon="lucide:mail" className="inline text-current mt-0" />
              <p className="text-foreground m-0 leading-none inline max-sm:hidden underline group-hover:no-underline ml-[0.4em]">
                Email
              </p>
            </span>
          </Link>
        </ul>
      </div>
    </header>
  );
};
