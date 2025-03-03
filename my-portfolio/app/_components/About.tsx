import React, { ComponentPropsWithoutRef } from "react";
import { Section } from "./Misc/Section";
import { Polymer } from "./Icons/Polymer";
import { Medtech } from "./Icons/Medtech";
import { cn } from "@/lib/utils";
import { SWEIcon } from "./Icons/SWEIcon";
import { Badge } from "@/components/ui/badge";
import { Code, DefaultIcon } from "./sharedComponents";
import Link from "next/link";
import { DukeHealth } from "./Icons/Duke Health";
import { HAIP } from "./Icons/HAIP";
import { AMA } from "./Icons/AMA";

export const About = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"} className="">
        About
      </Badge>


      <div className="flex max-md:flex-col gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <SWEIcon size={54} />
          <h3 className="text-2xl font-medium font-sans">Software Dev</h3>
          <p className="text-sm text-muted-foreground font-sans">
            I&apos;ve worked on projects to increase the accessibility of tools and technologies in healthcare, research, and academic spaces. You can check out my <Link href={"https://github.com/IslamTayeb"} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-all underline-offset-2">GitHub</Link> for my latest software development projects and contributions.
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-1 ">
          <Polymer size={54} />
          <h3 className="text-2xl font-medium font-sans">Research Work</h3>
          <p className="text-sm text-muted-foreground font-sans">
            3+ years of experience in academic and industrial settings with <Link href={"#publications"} className="underline hover:text-primary transition-all underline-offset-2"> multiple papers published</Link> in ML and organic chemistry. I&apos;m interested in protein design, protein language models, and reticular chemistry.
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <Medtech size={54} />
          <h3 className="text-2xl font-medium font-sans">
            Medical Technology
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            I&apos;ve developed medical technology solutions for <Code className="leading-relaxed"><DukeHealth size={16} className="-mt-0.5" />{" "}Duke Health</Code>{" "}, <Code className="leading-relaxed"><HAIP className="-mt-0.5 inline p-[0.5px]" height={16} width={14} />{" "}Health AI Partnership</Code>{" "}, and <Code className="leading-relaxed"><AMA height={16} width={14} className="inline -mt-0.5" />{" "}AMA</Code>{" "}, and competed nationally in medical device design competitions.
          </p>
        </div>

      </div>
    </Section>
  );
};
