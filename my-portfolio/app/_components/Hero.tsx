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
        "bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono text-sm",
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
    >
      <Section>
        <Badge variant={"outline"} className="mb-4">
          Welcome!
        </Badge>

        <div className="flex max-md:flex-col items-start gap-4">
          <div className="flex-[2] m-auto p-2">
            <Avatar className="w-full h-auto max-w-xs max-md:w-full max-md:center ml-auto">
              <AvatarImage
                className="object-cover scale-105 grayscale hover:grayscale-0 transition"
                src="https://i.ibb.co/vYG5FZN/myphoto.webp"
              />
              <AvatarFallback>Islam</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-[3] flex flex-col gap-0.5">
            <h2 className="font-caption font-semibold text-5xl text-foreground">
              Hello, <span className="text-accent-foreground">Islam</span> here!
            </h2>
            <h3 className="font-caption font-medium text-2xl">
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
                >
                  <p className="font-sans basis-0 text-muted-foreground pt-2">
                    Here is some additional content that becomes visible when
                    you click "Read More...". This could include more detailed
                    descriptions of your work, interests, or any other
                    information you'd like to share.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <Button
                variant="outline"
                className="my-3 p-4 font-sans"
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
