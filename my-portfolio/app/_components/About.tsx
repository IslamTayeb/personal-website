"use client";
import React, { ComponentPropsWithoutRef } from "react";
import { Section } from "./Misc/Section";
import { Polymer } from "./Icons/Polymer";
import { Medtech } from "./Icons/Medtech";
import { cn } from "@/lib/utils";
import { SWEIcon } from "./Icons/SWEIcon";
import { Badge } from "@/components/ui/badge";
import { initialize } from "next/dist/server/lib/render-server";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Code, DefaultIcon } from "./sharedComponents";

export const About = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 25 },
        }}
      >
        <Badge variant={"outline"} className="mb-4">
          About
        </Badge>
        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          I love working on...
        </h2>
      </motion.div>

      <div className="flex max-md:flex-col gap-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          className="flex-1"
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 25 },
          }}
        >
          <div className="flex flex-col gap-2">
            <Polymer size={54} />
            <h3 className="text-2xl font-medium font-sans">Chemistry Research</h3>
            <p className="text-sm text-muted-foreground font-sans ">
              I've worked on chemistry research for over 2+ years in academic, industrial, and competitive settings with 4 papers published, ranging from organic synthesis, physical/computational chemistry, and applied chemistry.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          className="flex-1"
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.2 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 25 },
          }}
        >
          <div className="flex flex-col gap-2">
            <Medtech size={54} />
            <h3 className="text-2xl font-medium font-sans">
              Medical Technology
            </h3>
            <p className="text-sm text-muted-foreground font-sans">
              I've worked on medical technology solutions for the Duke Health, Health AI Partnership, and the American Medical Associations and competed in national competitions where my team and I designed various medical devices. My skillset ranges from AI in healthcare to medical device design.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          className="flex-1"
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.4 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 25 },
          }}
        >
          <div className="flex flex-col gap-2">
            <SWEIcon size={54} />
            <h3 className="text-2xl font-medium font-sans">Software Dev</h3>
            <p className="text-sm text-muted-foreground font-sans">
              Plan it, create it, launch it. <Code>Huggingface API</Code>{" "}
              Collaborate seamlessly with all the organization and hit your
              marketing goals every month with our marketing plan.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
