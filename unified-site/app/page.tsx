import { Courses } from '@/components/site/courses';
import { Experience } from '@/components/site/experience';
import { Hero } from '@/components/site/hero';
import { Projects } from '@/components/site/projects';
import { Publications } from '@/components/site/publications';
import { WritingPreview } from '@/components/site/writing-preview';
import { RoybBand } from '@/components/primitives/royb-band';

export default function Home() {
  return (
    <>
      <header className="flex flex-col gap-3.5 py-7 md:py-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Islam Tayeb
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            unified prototype
          </span>
        </div>
        <RoybBand />
        <h1 className="max-w-2xl text-xl font-semibold leading-snug tracking-tight text-foreground text-balance md:text-2xl">
          One document surface for <span className="text-roy-r">work</span> and{' '}
          <span className="text-roy-b">writing</span>.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/80 text-pretty">
          Portfolio sections and APM Overflow posts now share the same
          typed-document system: sharp borders, mono metadata, ROYB accents, and
          no motion.
        </p>
      </header>
      <Hero />
      <Experience />
      <Projects />
      <Publications />
      <Courses />
      <WritingPreview />
    </>
  );
}
