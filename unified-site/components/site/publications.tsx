import { PublicationDisclosure } from '@/components/primitives/publication-disclosure';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { publications, scholarProfileUrl } from '@/data/publications';

export function Publications() {
  return (
    <Section
      id="publications"
      index="2"
      title="Publications"
      accent="text-roy-y"
    >
      <BorderedPanel>
        <PublicationDisclosure
          publications={publications}
          moreHref={scholarProfileUrl}
          moreLabel="See more on Scholar"
        />
      </BorderedPanel>
    </Section>
  );
}
