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

const Code = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono text-nowrap",
        className
      )}
      {...props}
    />
  );
};

export const About = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
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
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
        >
          <div className="flex flex-col gap-2">
            <Polymer size={54} />
            <h3 className="text-2xl font-medium font-sans">Polymer Research</h3>
            <p className="text-sm text-muted-foreground font-sans">
              Plan it, create it, launch it. <Code>Huggingface API</Code>{" "}
              Collaborate seamlessly with all the organization and hit your
              marketing goals every month with our marketing plan.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
        >
          <div className="flex flex-col gap-2">
            <Medtech size={54} />
            <h3 className="text-2xl font-medium font-sans">
              Medical Technology
            </h3>
            <p className="text-sm text-muted-foreground font-sans">
              Plan it, create it, launch it. <Code>Huggingface API</Code>{" "}
              Collaborate seamlessly with all the organization and hit your
              marketing goals every month with our marketing plan.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
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
