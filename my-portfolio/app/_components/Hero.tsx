"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code, DefaultIcon } from "./sharedComponents";
import { Section } from "./Misc/Section";
import { Duke } from "./Icons/Duke";

export const Hero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const ExternalLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group ${className}`}>
      {children}
    </a>
  );

  const UnderlineSpan = ({ children }: { children: React.ReactNode }) => (
    <span className="underline group-hover:no-underline">{children}</span>
  );

  return (
    <Section className="">
      <Badge variant="outline" className="mb-4" id="hero">Welcome!</Badge>

      <div className="flex max-md:flex-col items-start gap-6">
        <div className="flex-[1.4] flex my-auto max-md:mx-auto w-3/4">
          <div className="w-full h-auto aspect-[0.8] max-w-xs mx-auto max-md:w-full max-md:mb-2 relative">
            {!imagesLoaded && <div className="absolute inset-0 rounded-lg z-10 bg-accent/20 animate-pulse" />}
            <Avatar className="w-full h-full relative border border-border">
              <AvatarImage className="object-cover absolute z-20 transition-all scale-110 -mt-2" src="/myphoto.webp" alt="Original Photo" />
              <AvatarFallback className="h-full opacity-0">Islam</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-[2.5] flex flex-col my-auto gap-1.5">

          <p className="font-sans text-muted-foreground text-pretty">
            <Code><Duke size={14} /> Duke</Code> student finding lazy automations. Love reading about{" "}
            <ExternalLink href="https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/"><UnderlineSpan>cool</UnderlineSpan></ExternalLink>{" "}
            <ExternalLink href="https://www.notion.com/blog/building-and-scaling-notions-data-lake"><UnderlineSpan>infra</UnderlineSpan></ExternalLink>{" "}
            <ExternalLink href="https://corecursive.com/066-sqlite-with-richard-hipp/"><UnderlineSpan>stories</UnderlineSpan></ExternalLink>.
            Based in <Code><DefaultIcon icon="flag:us-1x1" className="rounded-[1.5px]" /> Durham, NC</Code>.
          </p>

          <p className="font-sans text-muted-foreground text-pretty">
            I grew up between <Code><DefaultIcon icon="flag:eg-1x1" className="rounded-[1.5px]" /> Egypt</Code> and <Code><DefaultIcon icon="flag:sa-1x1" className="rounded-[1.5px]" /> Saudi Arabia</Code>.
            I&#39;m a big fan of <ExternalLink href="https://open.spotify.com/user/zipdczhtagmnksbxxvobzv1l1?si=06358152c977484d"><Code><DefaultIcon icon="clarity:cd-dvd-solid" /> <UnderlineSpan>Alternative Hip Hop</UnderlineSpan></Code></ExternalLink> and enjoy playing{" "}
            <ExternalLink href="https://ch.tetr.io/u/mivi"><Code><DefaultIcon icon="fluent:tetris-app-16-filled" /> <UnderlineSpan>Tetris</UnderlineSpan></Code></ExternalLink> and <ExternalLink href="https://monkeytype.com/profile/Mivi"><Code><DefaultIcon icon="simple-icons:monkeytype" /> <UnderlineSpan>Monkeytype</UnderlineSpan></Code></ExternalLink>.
          </p>

          <p className="font-sans text-muted-foreground text-pretty">
            I nearly dropped out of high school to work full-time as a <Code><DefaultIcon icon="material-symbols:design-services" /> graphic designer</Code> for an esports team.
            Around the same time, I was playing <ExternalLink href="https://osu.ppy.sh/users/11749586"><Code><DefaultIcon icon="simple-icons:osu" /> <UnderlineSpan>osu!</UnderlineSpan></Code></ExternalLink> professionally
            and designed skins that were downloaded <span className="font-medium">500K+ times</span>.
            I initially came into Duke as a pre-med computational chemist, but kept gravitating toward the computational part.
          </p>

          <p className="font-sans text-muted-foreground text-pretty">
            Feel free to reach out at <a href="mailto:islam.moh.islamm@gmail.com" className="text-primary underline hover:no-underline">islam.moh.islamm@gmail.com</a>!
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
