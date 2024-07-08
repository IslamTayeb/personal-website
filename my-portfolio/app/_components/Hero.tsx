/* eslint-disable react/no-unescaped-entities */
"use client";
import { ComponentPropsWithoutRef, useState } from "react";
import { MoonIcon } from "./Icons/MoonIcon";
import { Section } from "./Misc/Section";
import { Typewriter, Cursor } from "react-simple-typewriter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Duke } from "./Icons/Duke";
import { Atom, Braces, Dna } from "lucide-react";

const Code = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono text-sm text-nowrap",
        className
      )}
      {...props}
    />
  );
};

export const Hero = () => {
  const [showMore, setShowMore] = useState(false);

  const handleReadMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      className="ease-in-out"
    >
      <Section>
        <Badge variant={"outline"} className="mb-4">
          Welcome!
        </Badge>
        <div className="flex max-md:flex-col items-start gap-4">
          <div className="flex-[2] p-2 flex my-auto">
            <Avatar className="w-11/12 h-auto max-w-xs mx-auto max-md:w-full max-md:my-2 relative">
              <AvatarImage
                className="object-cover scale-105 absolute top-0 left-0 w-full h-full transition-opacity opacity-0 hover:opacity-100 z-50 border border-accent mix-blend-color saturate-[0.98] -mt-[0.25em]"
                src="https://i.ibb.co/vYG5FZN/myphoto.webp"
                alt="Original Photo"
              />
              <AvatarImage
                className="object-cover scale-105 relative contrast-[1.12] border border-accent -mt-[0.25em]"
                src="https://i.ibb.co/BPVgwFb/myphotogradient.webp"
                alt="Gradient Photo"
              />
              <AvatarFallback>Islam</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-[3] flex flex-col gap-0.5 my-auto">
            <h2 className="font-caption font-semibold text-5xl text-foreground">
              Hello, <span className="text-accent-foreground">Islam</span> here!
            </h2>
            <h3 className="font-caption font-medium text-2xl leading-tight">
              I&apos;m a{" "}
              <span className="text-primary">
                <Typewriter
                  words={[
                    "Software Developer",
                    "Research Analyst",
                    "Graphic Designer",
                  ]}
                  cursor
                  cursorColor="#a8b1c2"
                  cursorStyle="_"
                  typeSpeed={40}
                  loop={0}
                  deleteSpeed={25}
                  delaySpeed={2250}
                />
              </span>
            </h3>
            <p className="font-sans basis-0 text-muted-foreground">
              <Code>
                <Braces size={14} className="inline" /> Computer Science
              </Code>{" "}
              ,{" "}
              <Code>
                <Dna size={14} className="inline" /> Bioinformatics
              </Code>{" "}
              , and{" "}
              <Code>
                <Atom size={14} className="inline" /> Chemistry
              </Code>{" "}
              student at{" "}
              <Code>
                <Duke size={14} className="text-center" /> Duke University
              </Code>
              . Interested in software development, data analysis, computational
              and synthetic chemistry, and medical technology.
            </p>
            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ ease: "easeInOut", duration: 0.15 }}
                  className="ease-in-out"
                >
                  <p className="font-sans basis-0 text-muted-foreground pt-2">
                    Culpa mollit aliquip id cupidatat ea laboris aliquip
                    excepteur incididunt dolor laboris. Occaecat id anim
                    consequat anim esse incididunt incididunt cillum dolore.
                    Ipsum occaecat reprehenderit occaecat id dolor irure amet
                    voluptate occaecat quis.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <Button
                variant="outline"
                className="my-2 p-4 font-sans mb-0"
                onClick={handleReadMoreClick}
              >
                {showMore ? "Show Less..." : "Read More..."}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </motion.div>
  );
};
