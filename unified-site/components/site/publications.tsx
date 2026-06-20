import { PublicationDisclosure } from '@/components/primitives/publication-disclosure';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { publications, scholarProfileUrl } from '@/data/publications';

export function Publications() {
  return (
    <Section
      id="publications"
      index="4"
      title="Publications"
      accent="text-roy-y"
      note="Current publication content in the lab accordion treatment."
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
