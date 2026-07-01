import { PublicationDisclosure } from '@/components/primitives/publication-disclosure';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { publications, scholarProfileUrl } from '@/data/publications';

export function Publications() {
  return (
    <Section
      id="publications"
      index="3"
      title="Selected Publications"
      accent="text-roy-y"
      divided
    >
      <BorderedPanel>
        <PublicationDisclosure
          publications={publications}
          moreHref={scholarProfileUrl}
          moreLabel="show more on Scholar..."
        />
      </BorderedPanel>
    </Section>
  );
}
