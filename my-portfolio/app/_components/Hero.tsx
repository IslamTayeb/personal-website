/* eslint-disable react/no-unescaped-entities */
"use client";
import { ComponentPropsWithoutRef } from "react";
import { MoonIcon } from "./Icons/MoonIcon";
import { Section } from "./Misc/Section";
import { Typewriter, Cursor } from "react-simple-typewriter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Code = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono",
        className
      )}
      {...props}
    />
  );
};

export const Hero = () => {
  return (
    <Section>
      <div className="flex max-md:flex-col items-start gap-4">
        {/* gap is for the gap between the cresent and the text */}
        {/* replace md with lg if you remove the cresent */}
        <div className="flex-[3] flex flex-col gap-0.5">
            <h2 className="font-caption font-semibold text-5xl text-primary">
              Islam Tayeb
            </h2>
            <h3 className="font-caption font-medium text-2xl">
              I'm a{" "}
              <Typewriter
                words={[
                  "Software Developer",
                  "Research Analyst",
                  "Graphic Designer",
                ]}
                cursor
                typeSpeed={50}
                loop={0}
                deleteSpeed={40}
                delaySpeed={2250}
              />
            </h3>
            <p className="font-sans basis-0 text-muted-foreground">
              Computer Science and Bioinformatics student at Duke University.
              Interested in software development, data analysis, computational
              and synthetic chemistry, and medical technology. Feel free to
              reach out at islam.tayeb@duke.edu!
            </p>
            <div>
              <Button variant="outline" className="my-3 p-4 font-sans">
                Read More...
              </Button>
            </div>
        </div>

          <div className="flex-[2] m-auto ">
            <MoonIcon className="w-full h-auto max-w-xs max-md:w-56 max-md:center ml-auto p-2" />
            {/* <img src="https://ibb.co/T036bW0" className="w-full h-auto max-w-lg max-lg:w-64" /> */}
          </div>
      </div>
    </Section>
  );
};
