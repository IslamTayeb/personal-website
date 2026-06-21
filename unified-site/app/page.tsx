import { Experience } from '@/components/site/experience';
import { Hero } from '@/components/site/hero';
import { Publications } from '@/components/site/publications';
import { WritingPreview } from '@/components/site/writing-preview';
import { RoybBand } from '@/components/primitives/royb-band';

export default function Home() {
  return (
    <>
      <RoybBand />
      <Hero />
      <Experience />
      <Publications />
      <WritingPreview />
    </>
  );
}
