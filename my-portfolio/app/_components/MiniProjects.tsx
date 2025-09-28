'use client';
import Link from 'next/link';
import { LucideGithub, Link2 } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Section } from './Misc/Section';

export const MiniProjects = () => {
  const [showAll, setShowAll] = useState(false);

  const miniProjectsData = [
    {
      name: 'Solve Log',
      description:
        'Centralize all my leetcode/neetcode prep into a repository with a simple interface',
      links: {
        github: 'https://github.com/IslamTayeb/solve-log',
        externalLink: 'https://solve-log.lovable.app/',
      },
    },
    {
      name: 'HyperX DuoCast RGB Override',
      description:
        "RGB mic clashed with my setup, so I learned USB control to customize it. Fuck HyperX doesn't support NGenuity on Mac.",
      links: {
        github: 'https://github.com/IslamTayeb/QuadcastRGB',
      },
    },
    {
      name: 'Instagram Non-Mutual Unfollower',
      description:
        'Had 2x the amount of following than followers on Instagram. Too much aura loss, so I made a bot to unfollow non-moots.',
      links: {
        github: 'https://github.com/IslamTayeb/instagram-unfollower',
      },
    },
    {
      name: 'Availability Checker',
      description:
        'CLI tool that checks my Google Calendar to see my availability and copies it to my clipboard.',
      links: {
        github: 'https://github.com/IslamTayeb/availability-checker',
      },
    },
    {
      name: 'Config Files',
      description:
        'Working on centralizing all my dotfiles and common CLI/Raycast tools into one repository.',
      links: {},
      wip: true,
    },
  ];

  const displayedProjects = showAll
    ? miniProjectsData
    : miniProjectsData.slice(0, 3);

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={'outline'} className="mb-4" id="mini-projects">
        Mini Projects
      </Badge>

      <div className="w-full divide-y divide-border">
        {displayedProjects.map((project) => (
          <div
            key={project.name}
            className="py-2.5 px-2.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary leading-tight">
                {project.name}
              </span>
              {project.wip && (
                <Badge
                  variant="secondary"
                  className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                >
                  WIP
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              {project.description}
            </p>
            {(project.links.github || project.links.externalLink) && (
              <div className="mt-0.5 flex gap-3">
                {project.links.github && (
                  <Link
                    href={project.links.github}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary underline hover:no-underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LucideGithub size={12} />
                    GitHub
                  </Link>
                )}
                {project.links.externalLink && (
                  <Link
                    href={project.links.externalLink}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary underline hover:no-underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Link2 size={12} />
                    Link
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="text-xs leading-none ml-auto text-muted-foreground/80 mt-3 justify-end flex items-center underline hover:no-underline font-mono tracking-wide hover:text-primary transition-colors"
      >
        {showAll ? 'Show less...' : 'See more...'}
      </button>
    </Section>
  );
};
