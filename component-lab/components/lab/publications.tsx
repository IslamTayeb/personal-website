'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { publications, type Publication } from '@/lib/lab-data';
import { cn } from '@/lib/utils';
import { Section, Variant } from './frame';
import { LabExternalLink } from './links';

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
          'grid w-full gap-2 px-2 py-2.5 text-left md:grid-cols-[5.5rem_1fr_auto]',
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
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-y">
            {publication.type}
          </span>
          <span className="text-xs leading-snug text-muted-foreground text-pretty">
            {publication.authors}
          </span>
          {publication.venue ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {publication.venue}
            </span>
          ) : null}
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
        <div className="grid gap-2 px-2 pb-3 md:grid-cols-[5.5rem_1fr]">
          <span aria-hidden />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="grid gap-1 text-xs leading-snug text-muted-foreground text-pretty">
              {publication.desc.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <LabExternalLink
                href={publication.href}
                className="section-color-y text-muted-foreground"
              >
                Full-text
              </LabExternalLink>
              {publication.venue && publication.venueHref ? (
                <LabExternalLink
                  href={publication.venueHref}
                  className="section-color-y text-muted-foreground"
                >
                  Journal
                </LabExternalLink>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function PublicationsSection() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <Section
      index="4"
      title="Publications — current-site accordion"
      accent="text-roy-y"
      cols={1}
      note="Real publication content from islamtayeb.dev, kept close to the current accordion: rows stay compact by default, and the contribution text opens only when selected."
    >
      <Variant label="Selected — collapsible publication rows" tag="draft">
        <div className="flex w-full flex-col gap-3">
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
          <div className="flex justify-end">
            <LabExternalLink
              href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ"
              className="section-color-y font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              See more on Scholar
            </LabExternalLink>
          </div>
        </div>
      </Variant>
    </Section>
  );
}
