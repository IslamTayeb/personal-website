'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code, DefaultIcon } from './sharedComponents';
import { Section } from './Misc/Section';
import { Duke } from './Icons/Duke';

export const Hero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const ExternalLink = ({
    href,
    children,
    className = '',
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${className}`}
    >
      {children}
    </a>
  );

  const UnderlineSpan = ({ children }: { children: React.ReactNode }) => (
    <span className="underline group-hover:no-underline">{children}</span>
  );

  return (
    <Section className="gap-4 flex flex-col items-start">
      <Badge variant="outline" id="hero">
        Welcome!
      </Badge>

      <div className="flex max-md:flex-col items-start gap-6">
        <div className="flex-[1.2] flex my-auto max-md:mx-auto w-3/4">
          <div className="w-full h-auto aspect-[0.85] max-w-xs mx-auto max-md:w-full max-md:mb-2 relative">
            {!imagesLoaded && (
              <div className="absolute inset-0 rounded-lg z-10 bg-accent/20 animate-pulse" />
            )}
            <Avatar className="w-full h-full relative border border-border rounded-lg">
              <AvatarImage
                className="object-cover absolute z-20 transition-all scale-110 -mt-2"
                src="/myphoto.webp"
                alt="Original Photo"
              />
              <AvatarFallback className="h-full opacity-0">
                Islam
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-[2.5] flex flex-col my-auto gap-1.5">
          <p className="font-sans text-muted-foreground text-pretty">
            <Code>
              <Duke size={14} className="-mt-[0.07em]" /> Duke
            </Code>{' '}
            junior finding lazy automations. Love reading about{' '}
            <ExternalLink href="https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/">
              <UnderlineSpan>cool</UnderlineSpan>
            </ExternalLink>{' '}
            <ExternalLink href="https://www.notion.com/blog/building-and-scaling-notions-data-lake">
              <UnderlineSpan>infra</UnderlineSpan>
            </ExternalLink>{' '}
            <ExternalLink href="https://corecursive.com/066-sqlite-with-richard-hipp/">
              <UnderlineSpan>stories</UnderlineSpan>
            </ExternalLink>{' '}
            and over-optimizing configs. Currently based in{' '}
            <Code>
              <DefaultIcon icon="flag:us-1x1" className="rounded-[1.5px]" />{' '}
              Durham, NC
            </Code>
            .
          </p>

          <p className="font-sans text-muted-foreground text-pretty">
            I grew up between{' '}
            <Code>
              <DefaultIcon icon="flag:eg-1x1" className="rounded-[1.5px]" />{' '}
              Egypt
            </Code>{' '}
            and{' '}
            <Code>
              <DefaultIcon icon="flag:sa-1x1" className="rounded-[1.5px]" />{' '}
              Saudi Arabia
            </Code>
            . I also enjoy playing{' '}
            <ExternalLink href="https://ch.tetr.io/u/mivi">
              <Code>
                <DefaultIcon icon="fluent:tetris-app-16-filled" />{' '}
                <UnderlineSpan>Tetris</UnderlineSpan>
              </Code>
            </ExternalLink>{' '}
            and{' '}
            <ExternalLink href="https://monkeytype.com/profile/Mivi">
              <Code>
                <DefaultIcon icon="simple-icons:monkeytype" />{' '}
                <UnderlineSpan>Monkeytype</UnderlineSpan>
              </Code>
            </ExternalLink>{' '}
            in my free time. I&apos;ve also been writing a bit, check out my{' '}
            <ExternalLink href="https://apmoverflow.xyz/">
              <Code>
                <DefaultIcon icon="lucide:command" />{' '}
                <UnderlineSpan>blog</UnderlineSpan>
              </Code>
            </ExternalLink>
            .
          </p>

          <p className="font-sans text-muted-foreground text-pretty">
            In high school, I worked as a graphic designer for an{' '}
            <a
              href="https://yuki.gg/"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              esports team
            </a>
            . Around the same time, I was playing{' '}
            <ExternalLink href="https://osu.ppy.sh/users/11749586">
              <Code>
                <DefaultIcon icon="simple-icons:osu" />{' '}
                <UnderlineSpan>osu!</UnderlineSpan>
              </Code>
            </ExternalLink>{' '}
            competitively and designed a{' '}
            <a
              href="https://skins.osuck.net/skins/1762?v=0"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              few
            </a>{' '}
            <a
              href="https://skins.osuck.net/skins/1464?v=0"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              skins
            </a>{' '}
            (<span>500K+ downloads</span>).
          </p>

          <p className="font-sans text-muted-foreground text-pretty">
            Feel free to reach out at{' '}
            <a
              href="mailto:islam.moh.islamm@gmail.com"
              className="underline hover:no-underline"
            >
              islam.moh.islamm@gmail.com
            </a>
            !
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
