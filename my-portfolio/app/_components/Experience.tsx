'use client';

import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Code, DefaultIcon } from './sharedComponents';
import { Section } from './Misc/Section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dynamic from 'next/dynamic';
import { useState } from 'react';

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
  const [showAll, setShowAll] = useState(false);
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);

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
      {visibleExperiences.map((experience, index) => (
        <div
          key={index}
          className="border border-dashed rounded-lg p-3 bg-card hover:bg-card/50 transition-colors"
        >
          <div className="flex flex-col gap-2">
            {/* Logo + Role + Company + Date on same line */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 min-w-12 min-h-12 text-primary">
                {renderLogo(experience.logo, experience.company)}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {/* Role + Company + Date */}
                <div className="flex items-center gap-2 justify-between leading-tight">
                  <div className="flex items-center gap-2 flex-wrap leading-tight">
                    <h3 className="font-medium text-base leading-tight font-sans text-primary">
                      {experience.role}
                    </h3>
                    {experience.status === 'present' && (
                      <Badge
                        variant="default"
                        className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1"
                      >
                        Present
                      </Badge>
                    )}
                    {experience.status === 'incoming' && (
                      <Badge
                        variant="secondary"
                        className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1"
                      >
                        Incoming
                      </Badge>
                    )}
                    {experience.company === 'Soff' && (
                      <Badge
                        variant="outline"
                        className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono leading-none"
                      >
                        Employee #2
                      </Badge>
                    )}
                    <span className="text-muted-foreground font-normal text-base leading-tight -ml-2">,</span>
                    <span className="text-muted-foreground font-normal text-base font-sans leading-tight">
                      {experience.website ? (
                        <a
                          href={experience.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-normal font-sans inline-flex items-center text-muted-foreground underline-2 hover:no-underline gap-0.5 underline leading-tight"
                        >
                          {experience.company}
                        </a>
                      ) : (
                        <span className="font-normal font-sans text-muted-foreground/80 leading-tight">
                          {experience.company}
                        </span>
                      )}
                    </span>
                  </div>
                  {experience.period && (
                    <span className="font-light text-muted-foreground text-sm whitespace-nowrap leading-tight">
                      {experience.period}
                    </span>
                  )}
                </div>
                {/* Description */}
                <p className="text-muted-foreground font-normal text-base font-sans leading-tight">
                  {experience.responsibilities[0]}
                </p>
              </div>
            </div>

            {/* Skills */}
            {experience.skills && experience.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, skillIndex) => (
                  <Code key={skillIndex}>
                    <span className="flex items-center gap-1.5 h-4 text-sm">
                      <DefaultIcon
                        icon={skill.icon}
                        className="inline text-current mt-[0.75px]"
                        height="14px"
                      />
                      {skill.name}
                    </span>
                  </Code>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {experiences.length > 2 && (
        <div className="flex justify-end w-full">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs leading-none text-muted-foreground/80 -mt-0.5 flex items-center underline hover:no-underline tracking-wide"
          >
            {showAll ? 'See less...' : 'See more...'}
          </button>
        </div>
      )}
    </Section>
  );
}

const experiences = [
  {
    role: 'ML Research Assistant',
    company: 'Duke University',
    logo: 'Icons/DukeUni2.tsx',
    period: 'Aug 2025 – Present',
    location: 'Durham, NC',
    website: 'https://www.romerolab.org/',
    responsibilities: [
      'Protocol mining and similarity search for enzyme assays',
    ],
    skills: [
      // { name: 'PyTorch', icon: 'simple-icons:pytorch' },
      // { name: 'FastAPI', icon: 'simple-icons:fastapi' },
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Soff (YC S24)',
    website: 'https://soff.ai/',
    logo: 'Icons/Soff.tsx',
    period: 'May 2025 – Oct 2025',
    location: 'San Francisco, CA',
    responsibilities: [
      'Sales and procurement automation tools for manufacturers as employee #2',
    ],
    skills: [
      // { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
      // { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Helian',
    website: 'https://www.helian.ai/',
    logo: 'Icons/Helian.tsx',
    period: 'Dec 2024 – May 2025',
    location: 'Durham, NC',
    responsibilities: [
      'Literature and news analysis tools for medical research workflows',
    ],
    skills: [
      // { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
      // { name: 'FastAPI', icon: 'simple-icons:fastapi' },
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Life Edit',
    website: 'https://lifeeditinc.com/',
    logo: 'Icons/Lifeedit.tsx',
    period: 'Sep 2024 – May 2025',
    location: 'Durham, NC',
    responsibilities: [
      'RNA-seq analysis dashboard and validation pipeline for CRISPR experiments',
    ],
    skills: [
      // { name: 'LangGraph', icon: 'simple-icons:langchain' },
    ],
  },
  {
    role: 'ML Research Assistant',
    company: 'Duke University',
    logo: 'Icons/DukeUni2.tsx',
    period: 'Oct 2024 – Apr 2025',
    location: 'Durham, NC',
    website: 'https://sites.duke.edu/navid/',
    responsibilities: [
      <>Continual learning model for antibody-antibody affinity prediction (<a href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">1 pre-print</a>)</>,
    ],
    skills: [
      // { name: 'PyTorch', icon: 'simple-icons:pytorch' },
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'DIHI',
    website: 'https://dihi.org/',
    logo: 'Icons/DIHI.tsx',
    period: 'Jun 2024 – Aug 2024',
    location: 'Durham, NC',
    responsibilities: [
      'Automated literature review system and medical record analysis tools',
    ],
    skills: [
      // { name: 'React', icon: 'simple-icons:react' },
      // { name: 'FastAPI', icon: 'simple-icons:fastapi' },
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Project: Sapien',
    website: 'https://www.projectsapien.com/',
    logo: 'Icons/Sapien.tsx',
    period: 'Nov 2023 – Feb 2024',
    location: 'Princeton, NJ',
    responsibilities: [
      'Survey platform with NLP tools for population health researchers',
    ],
    skills: [
      // { name: 'React', icon: 'simple-icons:react' },
      // { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
    ],
  },
  {
    role: 'ML Research Assistant',
    company: 'Saudi Aramco',
    website: 'https://www.aramco.com/',
    logo: 'Icons/Aramco.tsx',
    period: 'Jul 2022 – Sep 2023',
    location: 'Dhahran, Saudi Arabia',
    responsibilities: [
      <>ML and polymer synthesis for CO₂ capture (<a href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">3 publications</a>)</>,
    ],
    skills: [
      // { name: 'Python', icon: 'simple-icons:python' },
      // { name: 'Materials Science', icon: 'mdi:molecule' },
    ],
  },
];
