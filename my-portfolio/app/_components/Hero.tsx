"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code, DefaultIcon } from "./sharedComponents";
import Link from "next/link";
import { Section } from "./Misc/Section";
import { Duke } from "./Icons/Duke";

export const Hero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  return (
    <Section className="">
      <Badge variant="outline" className="mb-4" id="hero">
        Welcome!
      </Badge>
      <div className="flex max-md:flex-col items-start gap-6">
        {/* Avatar section with skeleton */}
        <div className="flex-[1.4] flex my-auto max-md:mx-auto w-3/4">
          <div className="w-full h-auto aspect-square max-w-xs mx-auto max-md:w-full max-md:mb-2 relative">
            {!imagesLoaded && (
              <div className="absolute inset-0 rounded-2xl z-10 bg-accent/20 animate-pulse" />
            )}
            <Avatar className="w-full h-full relative border border-border">
              <AvatarImage
                className="object-cover absolute z-20 transition-all scale-105"
                src="/myphoto.webp"
                alt="Original Photo"
              />
              <AvatarFallback className="h-full opacity-0">Islam</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-[3] flex flex-col gap-0.5 my-auto">
          <h2 className="font-caption font-semibold text-3xl text-foreground">
            Hey, I&apos;m <span className="text-accent-foreground">Islam</span>!
          </h2>
          <p className="font-sans basis-0 text-muted-foreground text-pretty">A <Code className=""><Duke size={14} /> Duke University</Code> student interested in AI/ML pipelines and infrastructure. Currently based in <Code><DefaultIcon icon="flag:us-1x1" className="rounded-[1.5px]" /> Durham, NC</Code>.</p>

          <p className="font-sans basis-0 text-muted-foreground text-pretty mt-0.5">I grew up between <Code><DefaultIcon icon="flag:eg-1x1" className="rounded-[1.5px]" /> Egypt</Code> and <Code><DefaultIcon icon="flag:sa-1x1" className="rounded-[1.5px]" /> Saudi Arabia</Code>. I&#39;m a big fan of <Code><DefaultIcon icon="clarity:cd-dvd-solid" /> <a href="https://open.spotify.com/user/zipdczhtagmnksbxxvobzv1l1?si=06358152c977484d" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-all">Alternative Hip Hop</a></Code> and enjoy playing <Code><DefaultIcon icon="fluent:tetris-app-16-filled" /> <a href="https://ch.tetr.io/u/mivi" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-all">Tetris</a></Code> and <Code><DefaultIcon icon="simple-icons:monkeytype" /> <a href="https://monkeytype.com/profile/Mivi" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-all">Monkeytype</a></Code> in my free time.</p>

          {/* <p className="font-sans basis-0 text-muted-foreground text-pretty mt-0.5">Feel free to <Link href="#contact" className="underline hover:text-primary transition-all underline-offset-2">reach out</Link>!</p> */}
          </div>
      </div>
    </Section>
  );
};

export default Hero;
