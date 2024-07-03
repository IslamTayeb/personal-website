"use client";
import React from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Skills = () => {
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
          Skills
        </Badge>
        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          My skills include...
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        className="w-full"
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-2/6 font-extrabold">
                Category
              </TableHead>
              <TableHead className="text-left w-4/6 font-extrabold">
                Technologies
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-accent-foreground">
            <TableRow>
              <TableCell className="font-medium">
                Programming Languages
              </TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Web Development</TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Machine Learning</TableCell>
              <TableCell className="flex gap-x-2">
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger>
                      {" "}
                      <div>
                        <Icon
                          className="hover:blur absolute transition-all opacity-50"
                          icon="mdi:react"
                          width="3em"
                          height="3em"
                        />
                        <Icon
                          className=""
                          icon="mdi:react"
                          width="3em"
                          height="3em"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">React</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div>
                  <Icon
                    className="hover:blur absolute transition-all opacity-50"
                    icon="mdi:react"
                    width="2em"
                    height="2em"
                  />
                  <Icon
                    className=""
                    icon="mdi:react"
                    width="2em"
                    height="2em"
                  />
                </div>
                <div>
                  <Icon
                    className="hover:blur absolute transition-all opacity-50"
                    icon="mdi:react"
                    width="2em"
                    height="2em"
                  />
                  <Icon
                    className=""
                    icon="mdi:react"
                    width="2em"
                    height="2em"
                  />
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Deployment & Integration
              </TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Research</TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </motion.div>
    </Section>
  );
};
