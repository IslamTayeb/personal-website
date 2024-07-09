/* eslint-disable react/no-unescaped-entities */
"use client";
import { ComponentPropsWithoutRef, useState } from "react";
import { MoonIcon } from "./Icons/MoonIcon";
import { Section } from "./Misc/Section";
import { Typewriter, Cursor } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Duke } from "./Icons/Duke";
import { Code, DefaultIcon } from "./sharedComponents";

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
      transition={{ duration: 0.2, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 25 },
      }}
      className="ease-in-out"
    >
      <Section>
        <Badge variant={"outline"} className="mb-4">
          Welcome!
        </Badge>
        <div className="flex max-md:flex-col items-start gap-4">
          <div className="flex-[2] p-2 flex my-auto max-md:mx-auto">
            <Avatar className="w-11/12 h-auto max-w-xs mx-auto max-md:w-full max-md:my-2 relative border border-accent">
              <AvatarImage
                className="object-cover scale-105 absolute top-0 left-0 w-full h-full transition-opacity opacity-0 hover:opacity-100 z-50 mix-blend-color saturate-[0.98] -mt-[0.25em] contrast-[1.1]"
                src="https://i.ibb.co/vYG5FZN/myphoto.webp"
                alt="Original Photo"
              />
              <AvatarImage
                className="object-cover scale-105 relative contrast-[1.12] -mt-[0.25em] brightness-[0.95]"
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
            <h3 className="font-caption font-medium text-2xl">
              I&apos;m a{" "}
              <span className="text-primary">
                <Typewriter
                  words={[
                    "Software Developer",
                    "Research Assistant",
                    "Research Analyst",
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
            <p className="font-sans basis-0 text-muted-foreground text-pretty">
              I study{" "}
              <Code>
                <DefaultIcon icon={"lucide:braces"} className="" /> Computer
                Science
              </Code>{" "}
              ,{" "}
              <Code>
                <DefaultIcon icon={"lucide:dna"} className="" /> Bioinformatics
              </Code>{" "}
              , and{" "}
              <Code>
                <DefaultIcon icon={"lucide:atom"} className="" /> Chemistry
              </Code>{" "}
              at{" "}
              <Code>
                <Duke size={14} className="text-center" /> Duke University
              </Code>{" "}
              . Currently based in{" "}
              <Code>
                <DefaultIcon icon={"flag:us-1x1"} className="rounded-[1.5px]" />{" "}
                Durham, NC
              </Code>{" "}
              with an interest in applied research and AI/ML.
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
                  <p className="font-sans basis-0 text-muted-foreground pt-1 text-pretty">
                    I grew up between{" "}
                    <Code>
                      <DefaultIcon
                        icon={"flag:eg-1x1"}
                        className="rounded-[1.5px]"
                      />{" "}
                      Alexandria, Egypt
                    </Code>{" "}
                    and{" "}
                    <Code>
                      <DefaultIcon
                        icon={"flag:sa-1x1"}
                        className="rounded-[1.5px]"
                      />{" "}
                      Taif, Saudi Arabia
                    </Code>{" "}
                    . I spent four years doing graphic design professionally—I
                    eventually shifted my focus, but I still design as a hobby.
                    I'm a huge fan of{" "}
                    <Code>
                      <DefaultIcon icon={"clarity:cd-dvd-solid"} className="" />{" "}
                      Alternative Hip Hop
                    </Code>{" "}
                    , and I like to play{" "}
                    <Code>
                      <DefaultIcon
                        icon={"fluent:tetris-app-16-filled"}
                        className=""
                      />{" "}
                      Tetris
                    </Code>{" "}
                    in my free time between classes and work.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <Button
                variant="outline"
                className="my-2.5 p-4 font-sans mb-0"
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
