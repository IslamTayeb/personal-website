'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Publication } from '@/types/content';
import { ExternalLink } from './external-link';
import { RailItem, RailList } from './rail';
import { SectionActionLink } from './section-action';

function PublicationAuthors({ authors }: { authors: string }) {
  return (
    <span
      data-testid="publication-authors"
      className="mt-1 block truncate text-xs leading-snug text-muted-foreground"
    >
      {authors.split(/(Islam Tayeb)/g).map((part, index) =>
        part === 'Islam Tayeb' ? (
          <strong
            key={`${part}-${index}`}
            data-testid="publication-author-self"
            className="font-semibold text-foreground"
          >
            {part}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </span>
  );
}

function PublicationRow({
  publication,
  open,
  isLast,
  onToggle,
}: {
  publication: Publication;
  open: boolean;
  isLast: boolean;
  onToggle: () => void;
}) {
  const chevron = (
    <span className="text-muted-foreground" aria-hidden>
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
  );

  return (
    <RailItem
      testId="publication-row"
      connectorTestId="publication-connector"
      dotTestId="publication-dot"
      titleTestId="publication-title-wrap"
      rowButtonTestId="publication-row-button"
      dotClassName="bg-foreground/75"
      className="pb-2.5"
      connector={isLast ? 'none' : 'solid'}
      onActivate={onToggle}
      ariaExpanded={open}
      title={
        <span className="block min-w-0">
          <span
            data-testid="publication-title"
            className="block text-sm font-medium leading-tight text-foreground text-pretty"
          >
            {publication.title}
          </span>
          <span
            data-testid="publication-meta-line"
            className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
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
          <PublicationAuthors authors={publication.authors} />
        </span>
      }
      meta={
        <span className="flex items-center gap-3">
          <span data-testid="publication-date">{publication.date}</span>
          {chevron}
        </span>
      }
      footer={
        open ? (
          <div
            data-testid="publication-open"
            className="flex min-w-0 flex-col gap-2"
          >
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
        ) : null
      }
    />
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
      <RailList testId="publication-rail">
        {publications.map((publication, index) => (
          <PublicationRow
            key={publication.title}
            publication={publication}
            open={openTitle === publication.title}
            isLast={index === publications.length - 1}
            onToggle={() =>
              setOpenTitle((current) =>
                current === publication.title ? null : publication.title
              )
            }
          />
        ))}
      </RailList>
      {moreHref ? (
        <div className="flex justify-end">
          <SectionActionLink href={moreHref} section="y">
            {moreLabel}
          </SectionActionLink>
        </div>
      ) : null}
    </div>
  );
}
