import type { Publication } from '@/types/content';
import { ExternalLink } from './external-link';
import { RailActionItem, RailItem, RailList } from './rail';
import { RichText } from './rich-text';
import { SectionActionLink } from './section-action';

function PublicationAuthors({ authors }: { authors: string }) {
  return (
    <span
      data-testid="publication-authors"
      className="reading-copy text-base font-normal leading-snug text-foreground"
    >
      {authors.split(/(Islam Tayeb)/g).map((part, index) =>
        part === 'Islam Tayeb' ? (
          <span
            key={`${part}-${index}`}
            data-testid="publication-author-self"
            className="font-semibold italic text-foreground"
          >
            {part}
          </span>
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
  const metadata = publication.venue
    ? `${publication.type} / ${publication.venue}`
    : publication.type;

  return (
    <RailItem
      testId="publication-row"
      connectorTestId="publication-connector"
      dotTestId="publication-dot"
      titleTestId="publication-title-wrap"
      dotClassName="bg-foreground/75"
      hoverAccent="y"
      connector={connector}
      title={
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="block min-w-0">
            <ExternalLink
              href={publication.href}
              section="y"
              data-rail-hover-source="true"
              data-testid="publication-title"
              className="publication-title-link text-base font-semibold leading-tight text-foreground"
            >
              <RichText text={publication.title} />
            </ExternalLink>
          </span>
          <PublicationAuthors authors={publication.authors} />
          <span
            data-testid="publication-meta-line"
            className="reading-copy text-base font-normal leading-snug text-muted-foreground"
          >
            <RichText text={metadata} />
          </span>
        </span>
      }
      meta={<span data-testid="publication-date">{publication.date}</span>}
    />
  );
}

export function PublicationDisclosure({
  publications,
  moreHref,
  moreLabel = 'show more...',
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
              connector={isLast ? (moreHref ? 'dashed' : 'none') : 'solid'}
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
