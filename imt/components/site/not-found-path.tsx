'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Shows the address the visitor actually asked for. The 404 page is
 * prerendered once, so the path is filled in only on the client to keep
 * the server and hydration markup identical.
 */
export function NotFoundPath() {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const shown = hydrated && pathname ? pathname : '/…';

  return (
    <span data-testid="not-found-path" className="font-mono text-sm">
      {shown}
    </span>
  );
}
