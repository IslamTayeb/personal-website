import type { Publication } from '@/types/content';
import { ExternalLink } from './external-link';
import { RailActionItem, RailItem, RailList } from './rail';
import { RichText } from './rich-text';
import { SectionActionLink } from './section-action';

function PublicationAuthors({ authors }: { authors: string }) {
  return (
    <span
      data-testid="publication-authors"
      className="reading-copy mt-1 block text-base font-normal leading-snug text-foreground"
    >
      {authors.split(/(Islam Tayeb)/g).map((part, index) =>
        part === 'Islam Tayeb' ? (
          <span
            key={`${part}-${index}`}
            data-testid="publication-author-self"
            className="font-medium italic text-foreground"
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
  return (
    <RailItem
      testId="publication-row"
      connectorTestId="publication-connector"
      dotTestId="publication-dot"
      titleTestId="publication-title-wrap"
      dotClassName="bg-foreground/75"
      connector={connector}
      title={
        <span className="block min-w-0">
          <ExternalLink
            href={publication.href}
            section="y"
            data-testid="publication-title"
            className="publication-title-link text-base font-medium leading-tight text-foreground"
          >
            <RichText text={publication.title} />
          </ExternalLink>
          <PublicationAuthors authors={publication.authors} />
          <span
            data-testid="publication-meta-line"
            className="reading-copy mt-1 block text-sm font-normal leading-snug text-muted-foreground"
          >
            {publication.type}
            {publication.venue ? (
              <>
                <span className="px-1">/</span>
                <span>
                  <RichText text={publication.venue} />
                </span>
              </>
            ) : null}
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
