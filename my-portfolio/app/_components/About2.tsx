import React from "react";
import { Section } from "./Misc/Section";
import { Badge } from "@/components/ui/badge";
import { Code, DefaultIcon } from "./sharedComponents";
import Link from "next/link";
import { DukeHealth } from "./Icons/Duke Health";
import { HAIP } from "./Icons/HAIP";
import { AMA } from "./Icons/AMA";

export const About2 = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"} className="">
        About
      </Badge>

      <div className="flex max-md:flex-col gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-2xl font-medium font-sans">Background</h3>
          <p className="text-sm text-muted-foreground font-sans">
            I grew up between{" "}
            <Code>
              <DefaultIcon
                icon="flag:eg-1x1"
                className="rounded-[1.5px]"
              />{" "}
              Egypt
            </Code>{" "}
            and{" "}
            <Code>
              <DefaultIcon
                icon="flag:sa-1x1"
                className="rounded-[1.5px]"
              />{" "}
              Saudi Arabia
            </Code>
            . I used to be a semi-professional graphic designer in
            esports for 4 years, but I still design as a hobby.
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-2xl font-medium font-sans">Interests</h3>
          <p className="text-sm text-muted-foreground font-sans">
            I&apos;m a big fan of{" "}
            <Code>
              <DefaultIcon icon="clarity:cd-dvd-solid" /> Alternative
              Hip Hop
            </Code>
            , and I like to play{" "}
            <Code>
              <DefaultIcon icon="fluent:tetris-app-16-filled" /> <a href="https://ch.tetr.io/u/mivi" target="_blank" rel="noopener noreferrer" className="underline-2">Tetris</a>
            </Code>{" "}
            in my free time between classes and work.
          </p>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-2xl font-medium font-sans">Writing</h3>
          <p className="text-sm text-muted-foreground font-sans">
            I write opinion articles on <Code><DefaultIcon icon="mdi:newspaper-variant" /> <a href="https://www.dukechronicle.com/staff/islam-tayeb" target="_blank" rel="noopener noreferrer" className="underline-2">Duke Chronicle</a></Code>.
          </p>
        </div>
      </div>
    </Section>
  );
};
