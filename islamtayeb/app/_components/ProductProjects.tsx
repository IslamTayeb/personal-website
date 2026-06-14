'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LucideGithub, Link2, FileText } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Section } from './Misc/Section';
import { Icon } from '@iconify/react';
import { Code, DefaultIcon } from './sharedComponents';

const VideoWithPlaceholder = ({
  videoSrc,
  placeholderSrc,
  mediaAlt,
  scale = 1,
}: {
  videoSrc: string;
  placeholderSrc: string;
  mediaAlt: string;
  scale?: number;
}) => (
  <div
    className="project-image-container bg-card/50 opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 max-md:brightness-50 saturate-0 hover:saturate-100 relative"
    style={{ transform: `scale(${scale})` }}
  >
    <Image
      src={placeholderSrc}
      fill
      alt={mediaAlt}
      quality={100}
      className="object-cover"
    />
    <video
      src={videoSrc}
      aria-label={mediaAlt}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
);

export const ProductProjects = () => {
  const projectsData = [
    {
      image: '/Harmonia.webm',
      projectName: 'Harmonia',
      mediaAlt:
        'Animated Harmonia preview showing a colored scatter plot of songs embedded by taste dimensions.',
      new: true,
      wip: false,
      videoScale: 1.6,
      projectDescription: (
        <>
          ML pipeline measuring chaotic audio and lyrics into 33 isolated,
          interpretable dimensions
        </>
      ),
      projectTech: ['Python', 'OpenAI', 'Plotly'],
      projectTechLogo: [
        'simple-icons:python',
        'simple-icons:openai',
        'simple-icons:plotly',
      ],
      projectExternalLinks: {
        github: 'https://github.com/IslamTayeb/harmonia',
        blog: 'https://apmoverflow.xyz/on-dimensions-of-taste/',
      },
    },
    {
      image: '/HeliumRaycast.webm',
      lockImage: '/HeliumRaycastLock.webp',
      projectName: 'Helium Browser Raycast Extension',
      mediaAlt:
        'Animated preview of the Helium Raycast extension workflow on a GitHub pull request page.',
      new: false,
      wip: false,
      projectDescription: (
        <>
          Raycast extension for jumping through Helium tabs, bookmarks, history,
          and web searches from the keyboard
        </>
      ),
      projectTech: ['TypeScript', 'Raycast API', 'AppleScript', 'SQLite'],
      projectTechLogo: [
        'simple-icons:typescript',
        'simple-icons:raycast',
        'mdi:apple',
        'file-icons:sqlite',
      ],
      projectExternalLinks: {
        github: 'https://github.com/raycast/extensions/pull/22290',
        externalLink: 'https://www.raycast.com/islamtayeb/helium',
      },
    },
    {
      image: '/Etchr.webm',
      lockImage: '/EtchrLock.webp',
      projectName: 'GitHub README Generator',
      mediaAlt:
        'Animated Etchr preview showing a README generator interface with repository sections and generated markdown.',
      new: false,
      wip: false,
      projectDescription: (
        <>
          Web app using LLMs to generate GitHub README files through codebase
          analysis with a sliding window technique
        </>
      ),
      projectTech: ['Next.js', 'Node.js', 'PostgreSQL'],
      projectTechLogo: [
        'simple-icons:nextdotjs',
        'simple-icons:nodedotjs',
        'simple-icons:postgresql',
      ],
      projectExternalLinks: {
        github: 'https://github.com/IslamTayeb/etchr',
        externalLink: 'https://www.etchr.dev/',
      },
    },
  ];

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={'outline'} className="mb-4" id="product-projects">
        Projects
      </Badge>

      <div className="projects-container">
        {projectsData.map(
          (
            {
              image,
              lockImage,
              projectDescription,
              projectExternalLinks,
              mediaAlt,
              projectName,
              projectTech,
              projectTechLogo,
              new: isNew,
              wip: isWip,
              videoScale,
            },
            index
          ) => {
            const isOdd = index % 2 !== 0;
            return (
              <div className="project max-md:w-full" key={projectName}>
                <div className="project-info gap-2.5">
                  <h3
                    className={`project-info-title antialiased max-md:w-full leading-tight flex flex-row items-center gap-2 text-primary  ${
                      isOdd ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="leading-none h-min invisible absolute max-md:visible max-md:relative text-left w-auto font-semibold">
                      {projectName}
                    </div>
                    {!isOdd && (isNew || isWip) && (
                      <>
                        {isNew && (
                          <Badge
                            variant="default"
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            New
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="secondary"
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            In Progress
                          </Badge>
                        )}
                      </>
                    )}
                    <div className="leading-none h-min visible relative max-md:invisible max-md:absolute font-semibold">
                      {projectName}
                    </div>
                    {isOdd && (isNew || isWip) && (
                      <>
                        {isNew && (
                          <Badge
                            variant="default"
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            New
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="secondary"
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            In Progress
                          </Badge>
                        )}
                      </>
                    )}
                  </h3>
                  <div className="project-info-description border border-dashed border-border/80 hover:border-border max-md:border-0 max-md:bg-transparent max-md:hover:bg-transparent bg-card hover:bg-[#1E2229] transition-all">
                    <p className="text-base">{projectDescription}</p>
                  </div>
                  <ul className="project-info-tech-list">
                    {projectTech.map((tech, index) => (
                      <li key={tech}>
                        <Code>
                          <DefaultIcon
                            icon={`${projectTechLogo[index]}`}
                            className="inline text-current"
                            height="14px"
                          />{' '}
                          {tech}
                        </Code>
                      </li>
                    ))}
                  </ul>
                  {(projectExternalLinks?.github ||
                    projectExternalLinks?.externalLink ||
                    projectExternalLinks?.blog) && (
                    <ul className="project-info-links max-md:w-full max-md:justify-end">
                      {projectExternalLinks?.blog && (
                        <li className="project-info-links-item">
                          <Link
                            href={projectExternalLinks.blog}
                            className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium underline hover:no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText size={14} /> Blog
                          </Link>
                        </li>
                      )}
                      {projectExternalLinks?.externalLink && (
                        <li className="project-info-links-item">
                          <Link
                            href={projectExternalLinks.externalLink}
                            className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium underline hover:no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Link2 size={14} /> Link
                          </Link>
                        </li>
                      )}
                      {projectExternalLinks?.github && (
                        <li className="project-info-links-item">
                          <Link
                            href={projectExternalLinks.github}
                            className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium underline hover:no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LucideGithub size={14} /> GitHub
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="project-image overflow-hidden scale-95 rounded-sm border border-border/50 max-md:rounded-lg">
                  {image.endsWith('.webm') && lockImage ? (
                    <VideoWithPlaceholder
                      videoSrc={image}
                      placeholderSrc={lockImage}
                      mediaAlt={mediaAlt}
                      scale={videoScale}
                    />
                  ) : image.endsWith('.webm') ? (
                    <div
                      className="project-image-container bg-card/50 opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 max-md:brightness-50 saturate-0 hover:saturate-100"
                      style={
                        videoScale
                          ? { transform: `scale(${videoScale})` }
                          : undefined
                      }
                    >
                      <video
                        src={image}
                        aria-label={mediaAlt}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="project-image-container opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 max-md:brightness-50 scale-110 saturate-0 hover:saturate-100">
                      <Image
                        src={image}
                        fill
                        alt={mediaAlt}
                        quality={100}
                        className=""
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
      <div className="flex justify-end w-full">
        <Link
          href="https://github.com/IslamTayeb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs leading-none text-muted-foreground/80 mt-3 flex items-center underline hover:no-underline font-mono tracking-wide"
        >
          See more on GitHub...
        </Link>
      </div>
    </Section>
  );
};
