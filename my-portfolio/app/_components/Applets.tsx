'use client';
import Link from 'next/link';
import { LucideGithub, Link2, Info } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Section } from './Misc/Section';

type Applet = {
  name: string;
  description: string;
  links: {
    github: string;
    externalLink?: string;
  };
  new?: boolean;
  wip?: boolean;
};

export const Applets = () => {
  const [showAll, setShowAll] = useState(false);

  const appletsData: Applet[] = [
    {
      name: 'Interview Solve Log',
      description:
        'Centralize all my leetcode/neetcode prep into a repository with a simple interface.',
      links: {
        github: 'https://github.com/IslamTayeb/solve-log',
        externalLink: 'https://solve-log.lovable.app/',
      },
    },
    {
      name: 'HyperX DuoCast RGB Override',
      description:
        'RGB mic clashed with my setup, so I learned USB control to customize it. Fuck HyperX.',
      links: {
        github: 'https://github.com/IslamTayeb/QuadcastRGB',
      },
    },
    {
      name: 'Instagram Non-Mutual Unfollower',
      description:
        'Had twice as many following as followers, so I made a bot to unfollow non-mutuals.',
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
      name: 'Job Sheet Tracker',
      description:
        'CLI tool that reads emails, uses Gemini to extract job details, and updates my Google Sheet.',
      links: {
        github: 'https://github.com/IslamTayeb/job-sheet-tracker',
      },
    },
    {
      name: 'Config Files',
      description:
        'Nix-managed dotfiles for shell/editor config. Includes Neovim, Zsh, Tmux.',
      links: {
        github: 'https://github.com/IslamTayeb/dotfiles',
      },
    },
  ];

  const displayedApplets = showAll
    ? appletsData
    : appletsData.slice(0, 3);

  return (
    <Section className="font-sans flex-col gap-4">
      <div className="mb-4 inline-flex items-center gap-2">
        <Badge variant={'outline'} id="mini-projects">
          Applets
        </Badge>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                size={14}
                className="text-muted-foreground/70 transition-colors cursor-help"
                aria-label="About mini projects"
              />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs mb-1 text-center">
              Compilation of vibe-coded apps I made & use daily.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="w-full divide-y divide-border">
        {displayedApplets.map((applet) => (
          <div
            key={applet.name}
            className="py-2.5 px-2.5 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary leading-tight text-md">
                {applet.name}
              </span>
              {applet.new && (
                <Badge
                  variant="default"
                  className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                >
                  New
                </Badge>
              )}
              {applet.wip && (
                <Badge
                  variant="secondary"
                  className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                >
                  WIP
                </Badge>
              )}
              {(applet.links.github || applet.links.externalLink) && (
                <div className="ml-auto flex gap-3">
                  {applet.links.externalLink && (
                    <Link
                      href={applet.links.externalLink}
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link2 size={14} />
                      Link
                    </Link>
                  )}
                  {applet.links.github && (
                    <Link
                      href={applet.links.github}
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LucideGithub size={14} />
                      GitHub
                    </Link>
                  )}
                </div>
              )}
            </div>
            <p className="text-base text-muted-foreground leading-relaxed mt-0.5">
              {applet.description}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="text-xs leading-none ml-auto text-muted-foreground/80 mt-3 justify-end flex items-center underline hover:no-underline font-mono tracking-wide transition-colors"
      >
        {showAll ? 'See less...' : 'See more...'}
      </button>
    </Section>
  );
};
