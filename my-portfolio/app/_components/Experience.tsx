'use client';

import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Code, DefaultIcon } from './sharedComponents';
import { Section } from './Misc/Section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Create a component registry object
const logoComponentRegistry = {
  'Duke Health': dynamic(
    () => import('./Icons/Duke Health').then((mod) => mod.DukeHealth),
    { ssr: true }
  ),
  DIHI: dynamic(() => import('./Icons/DIHI').then((mod) => mod.DIHI), {
    ssr: true,
  }),
  Aramco: dynamic(() => import('./Icons/Aramco').then((mod) => mod.Aramco), {
    ssr: true,
  }),
  Helian: dynamic(() => import('./Icons/Helian').then((mod) => mod.Helian), {
    ssr: true,
  }),
  Lifeedit: dynamic(
    () => import('./Icons/Lifeedit').then((mod) => mod.Lifeedit),
    { ssr: true }
  ),
  Sapien: dynamic(() => import('./Icons/Sapien').then((mod) => mod.Sapien), {
    ssr: true,
  }),
  Reveal: dynamic(() => import('./Icons/Reveal').then((mod) => mod.Reveal), {
    ssr: true,
  }),
  Soff: dynamic(() => import('./Icons/Soff').then((mod) => mod.Soff), {
    ssr: true,
  }),
  DukeUni: dynamic(() => import('./Icons/DukeUni').then((mod) => mod.DukeUni), {
    ssr: true,
  }),
  DukeUni2: dynamic(
    () => import('./Icons/DukeUni2').then((mod) => mod.DukeUni2),
    { ssr: true }
  ),
};

export function Experience() {
  const softwareExperiences = experiences.filter(
    (experience) => experience.category === 'software'
  );
  const researchExperiences = experiences.filter(
    (experience) => experience.category === 'research'
  );

  const renderLogo = (logo: string, company: string) => {
    // Handle TSX components
    if (typeof logo === 'string' && logo.endsWith('.tsx')) {
      const componentPath = logo.replace('.tsx', '');
      const componentName = componentPath.split('/').pop();

      if (componentName && componentName in logoComponentRegistry) {
        const LogoComponent =
          logoComponentRegistry[
          componentName as keyof typeof logoComponentRegistry
          ];
        return <LogoComponent className="w-full h-full" />;
      }

      return (
        <div className="w-full h-full flex items-center justify-center">
          {company[0]}
        </div>
      );
    }

    // Handle image URLs and icon strings
    return (
      <Avatar className="w-12 h-12 flex items-center justify-center rounded-md min-w-12 min-h-12">
        {typeof logo === 'string' &&
          (logo.startsWith('http') || logo.startsWith('/')) ? (
          <AvatarImage src={logo} className="object-contain" />
        ) : (
          <DefaultIcon icon={logo} className="w-6 h-6" />
        )}
        <AvatarFallback className="bg-primary text-primary-foreground flex items-center justify-center rounded-md">
          {company[0]}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <Section className="mx-auto space-y-4">
      <Badge variant="outline" className="" id="experience">
        Experience
      </Badge>
      <div className="space-y-2">
        <Badge variant="outline" className="w-fit">
          Research Experience
        </Badge>
        {researchExperiences.map((experience, index) => (
          <div key={`research-${index}`}>
            <div
              className="border border-border/80 hover:border-border border-dashed rounded-lg p-3 py-2 bg-card hover:bg-card/50 transition-colors"
            >
              {/* Main Content Section */}
              <div className="flex flex-col gap-2 flex-1">
                {/* Logo + Role + Company + Date on same line */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 min-w-12 min-h-12 text-primary">
                    {renderLogo(experience.logo, experience.company)}
                  </div>
                  <div className="flex-1 flex flex-col ">
                    {/* Role + Company + Date */}
                    <div className="flex items-center justify-between flex-wrap">
                      <span className="inline-flex items-center">
                        {experience.website ? (
                          <Link
                            href={experience.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline"
                          >
                            <span className="font-medium text-base font-sans text-primary">
                              {experience.role}<span className="text-muted-foreground font-normal text-base ">,{'\u00A0'}</span>
                            </span>
                            {experience.company === 'Soff' && (
                              <Badge
                                variant="outline"
                                className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono "
                              >
                                Employee #2
                              </Badge>
                            )}
                            <span className="font-normal font-sans text-muted-foreground underline hover:no-underline ">
                              {experience.company}
                            </span>
                          </Link>
                        ) : (
                          <>
                            <span className="font-medium text-base font-sans text-primary">
                              {experience.role}<span className="text-muted-foreground font-normal text-base ">,{'\u00A0'}</span>
                            </span>
                            {experience.company === 'Soff' && (
                              <Badge
                                variant="outline"
                                className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono "
                              >
                                Employee #2
                              </Badge>
                            )}
                            <span className="font-normal font-sans text-muted-foreground/80 ">
                              {experience.company}
                            </span>
                          </>
                        )}
                      </span>
                      {experience.period && (
                        <span className="font-light text-muted-foreground text-sm whitespace-nowrap ">
                          {experience.period}
                        </span>
                      )}
                    </div>
                    {/* Description with integrated skills */}
                    <span className="text-muted-foreground font-normal text-base font-sans">
                      {experience.responsibilities[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Badge variant="outline" className="w-fit">
          Software Experience
        </Badge>
        {softwareExperiences.map((experience, index) => (
          <div key={`software-${index}`}>
            <div
              className="border border-border/80 hover:border-border border-dashed rounded-lg p-3 py-2 bg-card hover:bg-card/50 transition-colors"
            >
              {/* Main Content Section */}
              <div className="flex flex-col gap-2 flex-1">
                {/* Logo + Role + Company + Date on same line */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 min-w-12 min-h-12 text-primary">
                    {renderLogo(experience.logo, experience.company)}
                  </div>
                  <div className="flex-1 flex flex-col ">
                    {/* Role + Company + Date */}
                    <div className="flex items-center justify-between flex-wrap">
                      <span className="inline-flex items-center">
                        {experience.website ? (
                          <Link
                            href={experience.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline"
                          >
                            <span className="font-medium text-base font-sans text-primary">
                              {experience.role}<span className="text-muted-foreground font-normal text-base ">,{'\u00A0'}</span>
                            </span>
                            {experience.company === 'Soff' && (
                              <Badge
                                variant="outline"
                                className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono "
                              >
                                Employee #2
                              </Badge>
                            )}
                            <span className="font-normal font-sans text-muted-foreground underline hover:no-underline ">
                              {experience.company}
                            </span>
                          </Link>
                        ) : (
                          <>
                            <span className="font-medium text-base font-sans text-primary">
                              {experience.role}<span className="text-muted-foreground font-normal text-base ">,{'\u00A0'}</span>
                            </span>
                            {experience.company === 'Soff' && (
                              <Badge
                                variant="outline"
                                className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono "
                              >
                                Employee #2
                              </Badge>
                            )}
                            <span className="font-normal font-sans text-muted-foreground/80 ">
                              {experience.company}
                            </span>
                          </>
                        )}
                      </span>
                      {experience.period && (
                        <span className="font-light text-muted-foreground text-sm whitespace-nowrap ">
                          {experience.period}
                        </span>
                      )}
                    </div>
                    {/* Description with integrated skills */}
                    <span className="text-muted-foreground font-normal text-base font-sans">
                      {experience.responsibilities[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const experiences = [
  {
    role: 'ML Research Assistant',
    company: 'Duke University',
    logo: 'Icons/DukeUni2.tsx',
    category: 'research',
    period: 'Aug 2025 – Present',
    location: 'Durham, NC',
    website: 'https://www.romerolab.org/',
    responsibilities: [
      <>
        Enzyme protocol mining tools{' '}
        <span className="inline-block">
          using{' '}
          <Code>
            <DefaultIcon icon="simple-icons:pytorch" className="inline text-current" height="14px" /> PyTorch
          </Code>
        </span>{' '}
        and{' '}
        <span className="inline-block">
          services in{' '}
          <Code>
            <DefaultIcon icon="simple-icons:fastapi" className="inline text-current" height="14px" /> FastAPI
          </Code>
        </span>
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Soff (YC S24)',
    website: 'https://soff.ai/',
    logo: 'Icons/Soff.tsx',
    category: 'software',
    period: 'May 2025 – Oct 2025',
    location: 'San Francisco, CA',
    responsibilities: [
      <>
        Sales intelligence for manufacturers{' '}
        <span className="inline-block">
          using{' '}
          <Code>
            <DefaultIcon icon="simple-icons:nextdotjs" className="inline text-current" height="14px" /> Next.js
          </Code>
        </span>{' '}
        and{' '}
        <span className="inline-block">
          <Code>
            <DefaultIcon icon="devicon-plain:trpc" className="inline text-current" height="14px" /> tRPC
          </Code>{' '}
          as employee #2
        </span>
      </>,
    ],
    skills: [],
  },
  {
    role: 'ML Engineer Intern',
    company: 'Life Edit',
    website: 'https://lifeeditinc.com/',
    logo: 'Icons/Lifeedit.tsx',
    category: 'software',
    period: 'Sep 2024 – May 2025',
    location: 'Durham, NC',
    responsibilities: [
      <>
        Non-linear RNA-seq analysis and dashboard for CRISPR experiments{' '}
        <span className="inline-block">
          using{' '}
          <Code>
            <DefaultIcon icon="simple-icons:python" className="inline text-current" height="14px" /> Python
          </Code>
        </span>
      </>,
    ],
    skills: [],
  },
  {
    role: 'ML Research Assistant',
    company: 'Duke University',
    logo: 'Icons/DukeUni2.tsx',
    category: 'research',
    period: 'Oct 2024 – Apr 2025',
    location: 'Durham, NC',
    website: 'https://sites.duke.edu/navid/',
    responsibilities: [
      <>
        Continual learning model for antibody affinity prediction{' '}
        <span className="inline-block">
          using{' '}
          <Code>
            <DefaultIcon icon="simple-icons:pytorch" className="inline text-current" height="14px" /> PyTorch
          </Code>
        </span>{' '}
        <span className="inline-block">
          (<a href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">1 pre-print</a>)
        </span>
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'DIHI',
    website: 'https://dihi.org/',
    logo: 'Icons/DIHI.tsx',
    category: 'software',
    period: 'Jun 2024 – Aug 2024',
    location: 'Durham, NC',
    responsibilities: [
      <>
        Automated literature review system{' '}
        <span className="inline-block">
          using{' '}
          <Code>
            <DefaultIcon icon="simple-icons:react" className="inline text-current" height="14px" /> React
          </Code>
        </span>{' '}
        and{' '}
        <span className="inline-block">
          <Code>
            <DefaultIcon icon="simple-icons:fastapi" className="inline text-current" height="14px" /> FastAPI
          </Code>
        </span>
      </>,
    ],
    skills: [],
  },
  {
    role: 'Research Assistant',
    company: 'Saudi Aramco',
    website: 'https://www.aramco.com/',
    logo: 'Icons/Aramco.tsx',
    category: 'research',
    period: 'Jul 2022 – Sep 2023',
    location: 'Dhahran, Saudi Arabia',
    responsibilities: [
      <>
        Traditional ML polymer synthesis for CO₂ capture{' '}
        <span className="inline-block">
          using{' '}
          <Code>
            <DefaultIcon icon="simple-icons:python" className="inline text-current" height="14px" /> Python
          </Code>
        </span>{' '}
        <span className="inline-block">
          (<a href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">3 publications</a>)
        </span>
      </>,
    ],
    skills: [],
  },
];
