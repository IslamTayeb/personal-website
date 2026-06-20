'use client';

import { useState } from 'react';
import { publications, type Publication } from '@/lib/lab-data';
import { Section, Variant } from './frame';
import { LabExternalLink } from './links';

function PublicationTags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

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
    <li className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full gap-2 px-2 py-2.5 text-left transition-colors hover:bg-muted/45 md:grid-cols-[5.5rem_1fr_auto]"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {publication.date}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-medium leading-tight text-foreground">
              {publication.title}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-y">
              {publication.type}
            </span>
          </span>
          <span className="text-xs leading-snug text-muted-foreground text-pretty">
            {publication.authors}
          </span>
          <span className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {publication.venue ? <span>{publication.venue}</span> : null}
            {publication.venue ? <span>/</span> : null}
            <span>{publication.impact}</span>
          </span>
          <PublicationTags tags={publication.tags} />
        </span>
        <span
          className="font-mono text-xs leading-none text-muted-foreground"
          aria-hidden
        >
          {open ? '⌄' : '›'}
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
