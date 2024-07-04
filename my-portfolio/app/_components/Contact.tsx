"use client";
import React from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const Contact = () => {
  return (
    <Section className="flex flex-col items-start gap-4">
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
        <Badge variant={"outline"} className="mb-4">
          Contact
        </Badge>
        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          Let&apos;s work together!
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        className="w-full"
        // viewport={{ once: true }}
        // transition={{ duration: 0.3 }}
        // variants={{
        //   visible: { opacity: 1, y: 0 },
        //   hidden:   { opacity: 0, y: 50 },
        // }}
      >
        <div className="flex max-md:flex-col flex-row gap-4">
          <Card className="font-sans font-medium w-full flex-[3] gap-2 p-4">
            Hi
          </Card>
          <Card className="font-sans font-medium flex-[2] w-full p-4">
            Hi
          </Card>
        </div>
      </motion.div>
    </Section>
  );
};
