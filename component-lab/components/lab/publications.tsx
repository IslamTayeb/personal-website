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

function PublicationRow({ publication }: { publication: Publication }) {
  return (
    <li className="grid gap-2 border-t border-border py-3 first:border-t-0 md:grid-cols-[5.5rem_1fr]">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {publication.date}
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <LabExternalLink
            href={publication.href}
            className="text-sm font-medium leading-tight text-foreground"
          >
            {publication.title}
          </LabExternalLink>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-y">
            {publication.type}
          </span>
        </div>

        <p className="text-xs leading-snug text-muted-foreground text-pretty">
          {publication.authors}
        </p>

        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {publication.venue && publication.venueHref ? (
            <LabExternalLink
              href={publication.venueHref}
              variant="step"
              className="text-muted-foreground"
            >
              {publication.venue}
            </LabExternalLink>
          ) : (
            <span>{publication.impact}</span>
          )}
          {publication.venue ? <span>/ {publication.impact}</span> : null}
        </div>

        <div className="grid gap-1 text-xs leading-snug text-muted-foreground text-pretty">
          {publication.desc.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <PublicationTags tags={publication.tags} />
      </div>
    </li>
  );
}

export function PublicationsSection() {
  return (
    <Section
      index="4"
      title="Publications — dense ledger"
      accent="text-roy-y"
      cols={1}
      note="Real publication content from islamtayeb.dev, flattened from the current accordion into a denser linked ledger with date, title, venue, impact, contribution, and tags always visible."
    >
      <Variant label="A — always-on publication ledger" tag="draft">
        <div className="flex w-full flex-col gap-3">
          <ul className="flex w-full flex-col">
            {publications.map((publication) => (
              <PublicationRow
                key={publication.title}
                publication={publication}
              />
            ))}
          </ul>
          <div className="flex justify-end">
            <LabExternalLink
              href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ"
              variant="sweep"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              See more on Scholar
            </LabExternalLink>
          </div>
        </div>
      </Variant>
    </Section>
  );
}
