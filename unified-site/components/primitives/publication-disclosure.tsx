'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Publication } from '@/types/content';
import { ExternalLink } from './external-link';

function PublicationRow({
  publication,
  open,
  onToggle,
}: {
  publication: Publication;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={cn(
        'border-t border-border first:border-t-0',
        open && 'bg-muted/45'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'grid w-full gap-2 px-2 py-2 text-left md:grid-cols-[5.5rem_1fr_auto]',
          !open && 'hover:bg-muted/45'
        )}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {publication.date}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-medium leading-tight text-foreground">
            {publication.title}
          </span>
          <span
            data-testid="publication-meta-line"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-y"
          >
            {publication.type}
            {publication.venue ? (
              <>
                <span className="px-1 text-muted-foreground">/</span>
                <span className="text-muted-foreground">
                  {publication.venue}
                </span>
              </>
            ) : null}
          </span>
          <span className="text-xs leading-snug text-muted-foreground text-pretty">
            {publication.authors}
          </span>
        </span>
        <span
          className="flex items-start pt-0.5 text-muted-foreground"
          aria-hidden
        >
          {open ? (
            <ChevronDown
              className="relative bottom-px"
              size={11}
              strokeWidth={1.8}
            />
          ) : (
            <ChevronRight
              className="relative bottom-px"
              size={11}
              strokeWidth={1.8}
            />
          )}
        </span>
      </button>
      {open ? (
        <div
          data-testid="publication-open"
          className="grid gap-2 px-2 pb-2.5 md:grid-cols-[5.5rem_1fr]"
        >
          <span aria-hidden />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="grid gap-1 text-xs leading-snug text-muted-foreground text-pretty">
              {publication.desc.map((paragraph) => (
                <p key={paragraph} data-one-line="true" className="truncate">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <ExternalLink
                href={publication.href}
                section="y"
                className="text-muted-foreground"
              >
                Full-text
              </ExternalLink>
              {publication.venue && publication.venueHref ? (
                <ExternalLink
                  href={publication.venueHref}
                  section="y"
                  className="text-muted-foreground"
                >
                  Journal
                </ExternalLink>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function PublicationDisclosure({
  publications,
  moreHref,
  moreLabel = 'See more',
}: {
  publications: Publication[];
  moreHref?: string;
  moreLabel?: string;
}) {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-2.5">
      <ul className="flex w-full flex-col">
        {publications.map((publication) => (
          <PublicationRow
            key={publication.title}
            publication={publication}
            open={openTitle === publication.title}
            onToggle={() =>
              setOpenTitle((current) =>
                current === publication.title ? null : publication.title
              )
            }
          />
        ))}
      </ul>
      {moreHref ? (
        <div className="flex justify-end">
          <ExternalLink
            href={moreHref}
            section="y"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
          >
            {moreLabel}
          </ExternalLink>
        </div>
      ) : null}
    </div>
  );
}
