import type { Publication } from '@/types/content';
import { ExternalLink } from './external-link';
import { RailActionItem, RailItem, RailList } from './rail';
import { RichText } from './rich-text';
import { SectionActionLink } from './section-action';

function PublicationAuthors({ authors }: { authors: string }) {
  return (
    <span
      data-testid="publication-authors"
      className="mt-1 block truncate text-sm leading-snug text-muted-foreground"
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
  connector,
}: {
  publication: Publication;
  connector: 'solid' | 'dashed' | 'none';
}) {
  return (
    <RailItem
      testId="publication-row"
      connectorTestId="publication-connector"
      dotTestId="publication-dot"
      titleTestId="publication-title-wrap"
      dotClassName="bg-foreground/75"
      className="pb-2.5"
      connector={connector}
      title={
        <span className="block min-w-0">
          <ExternalLink
            href={publication.href}
            section="y"
            data-testid="publication-title"
            className="publication-title-link royb-link-fragment text-sm font-medium leading-tight text-foreground text-pretty"
          >
            <RichText text={publication.title} />
          </ExternalLink>
          <span
            data-testid="publication-meta-line"
            className="mt-1 block truncate font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground"
          >
            {publication.type}
            {publication.venue ? (
              <>
                <span className="px-1 text-muted-foreground">/</span>
                <span className="text-muted-foreground">
                  <RichText text={publication.venue} />
                </span>
              </>
            ) : null}
          </span>
          <PublicationAuthors authors={publication.authors} />
        </span>
      }
      meta={<span data-testid="publication-date">{publication.date}</span>}
    />
  );
}

export function PublicationDisclosure({
  publications,
  moreHref,
  moreLabel = 'see more',
}: {
  publications: Publication[];
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="flex w-full flex-col">
      <RailList testId="publication-rail">
        {publications.map((publication, index) => {
          const isLast = index === publications.length - 1;

          return (
            <PublicationRow
              key={publication.title}
              publication={publication}
              connector={isLast ? 'none' : 'solid'}
            />
          );
        })}
        {moreHref ? (
          <RailActionItem testId="publication-action-row">
            <SectionActionLink href={moreHref} section="y">
              {moreLabel}
            </SectionActionLink>
          </RailActionItem>
        ) : null}
      </RailList>
    </div>
  );
}
