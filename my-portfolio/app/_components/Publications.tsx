import React, { ComponentPropsWithoutRef } from 'react';
import { Section } from './Misc/Section';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordionv3';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { ArrowUpRight, Link as Link2, LucideGithub } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Code, DefaultIcon } from './sharedComponents';

export const Publications = () => {
  const publicationsData = [
    {
      pubDate: 'Sep 2025',
      pubAuthors: (
        <>
          Hamid Zentou, Ali Tayeb,{' '}
          <span className="font-semibold text-primary">Islam Tayeb</span>,
          Mahmoud Abdelnaby
        </>
      ),
      pubImpact: 'Impact Factor: 7.2',
      pubTitle:
        'Machine learning for predicting and optimizing the CO₂ uptake in porous organic polymers',
      pubJournal: 'Journal of Environmental Chemical Engineering',
      pubJournalLink:
        'https://www.journals.elsevier.com/journal-of-environmental-chemical-engineering',
      pubType: 'Research Article',
      pubDescription: (
        <>
          <p className="mb-1.5">
            Developed a machine learning framework to predict CO
            <span
              style={{
                verticalAlign: 'sub',
                fontSize: 7.25,
                lineHeight: '1',
                fontWeight: 'bold',
              }}
            >
              2
            </span>{' '}
            adsorption capacity in porous organic polymers. Using gradient
            boosting and genetic algorithms, achieved R² = 0.963 accuracy.
          </p>
          <p>
            I helped develop the ML framework, performed data curation and
            processing, and helped write the original manuscript.
          </p>
        </>
      ),
      pubLink: 'https://authors.elsevier.com/c/1lnQz7tGO~Vp7o',
      pubCategory: [
        {
          name: 'Python',
          icon: 'simple-icons:python',
        },
        {
          name: 'Carbon Capture',
          icon: 'carbon:chemistry',
        },
        {
          name: 'Traditional ML',
          icon: 'icon-park-outline:tree-diagram',
        },
      ],
    },
    {
      pubDate: 'May 2025',
      pubAuthors: (
        <>
          <span className="font-semibold text-primary">Islam Tayeb</span>, Navid
          NaderiAlizadeh
        </>
      ),
      pubImpact: 'Pre-print',
      pubTitle: 'Primal Dual Continual Learning for Robust Antibody Design',
      pubJournal: null,
      pubJournalLink: null,
      pubType: 'Pre-print',
      pubDescription: (
        <>
          <p className="mb-1.5">
            Framework for handling distribution shifts in antibody design using
            constrained continual learning. Uses dual variables to adaptively
            allocate memory and prevent catastrophic forgetting across design
            cycles.
          </p>
          <p>
            I developed the algorithm and implemented the full framework for the
            Antibody DomainBed benchmark.
          </p>
        </>
      ),
      pubLink: 'https://doi.org/10.13140/RG.2.2.11182.98880',
      pubCategory: [
        {
          name: 'PyTorch',
          icon: 'simple-icons:pytorch',
        },
        {
          name: 'Protein Design',
          icon: 'fluent:molecule-16-filled',
        },
        {
          name: 'Continual Learning',
          icon: 'mdi:brain',
        },
      ],
    },
  ];

  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={'outline'} className="mb-1" id="publications">
        Selected Publications
      </Badge>

      <div className="w-full divide-y divide-border">
        {publicationsData.map(
          ({
            pubDate,
            pubAuthors,
            pubTitle,
            pubJournal,
            pubJournalLink,
            pubDescription,
            pubLink,
            pubImpact,
            pubType,
            pubCategory,
          }) => {
            return (
              <div
                className="project max-md:w-full text-primary w-full last:border-t-0"
                key={pubTitle}
              >
                <div className="w-full">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full font-sans"
                  >
                    <AccordionItem
                      value="item-1"
                      className="py-3.5 px-2.5 text-pretty flex flex-row transition gap-4 w-full hover:bg-muted/50 border-b-0"
                    >
                      <div className="flex items-center text-muted-foreground text-sm w-min text-left font-mono shrink-0">
                        <p className="">{pubDate}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-row w-full">
                          <div className="text-primary flex flex-col w-full">
                            <div className="text-base font-medium text-foreground w-full">
                              <span className="leading-tight transition text-primary block mb-0.5">
                                {pubTitle}
                              </span>
                            </div>
                            <div className="text-muted-foreground text-md font-normal ">
                              <Link
                                href={pubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                              >
                                <span className="underline group-hover:no-underline">
                                  Full-text
                                </span>
                              </Link>
                              {pubJournal && (
                                <span className="font-normal"> – </span>
                              )}
                              <TooltipProvider delayDuration={50}>
                                <Tooltip>
                                  <TooltipTrigger className="font-normal">
                                    {pubJournalLink ? (
                                      <div className="flex items-center gap-0">
                                        <div className="group">
                                          <Link
                                            href={pubJournalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                          >
                                            <span className="underline group-hover:no-underline">
                                              {pubJournal}
                                            </span>
                                          </Link>
                                        </div>
                                      </div>
                                    ) : (
                                      pubJournal
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent className="shadow-md shadow-card transition-all">
                                    <p>{pubImpact}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <span className="font-normal"> –</span>
                              <span className="font-light ml-0.5">
                                {' '}
                                {pubType}
                              </span>
                            </div>
                            <div className="text-muted-foreground  text-md font-light py-1.5">
                              {typeof pubAuthors === 'string' ? (
                                `- ${pubAuthors}`
                              ) : (
                                <>{pubAuthors}</>
                              )}
                            </div>
                          </div>
                        </div>
                        <AccordionContent className="mr-8 pb-3 pt-1 font-light text-base">
                          {pubDescription}
                        </AccordionContent>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          {pubCategory.map((category) => (
                            // consider using max-md:text-nowrap
                            <Code key={category.name} className="leading-4">
                              <DefaultIcon
                                icon={category.icon}
                                className="inline text-current"
                                height="14px"
                              />{' '}
                              {category.name}
                            </Code>
                          ))}
                        </div>
                      </div>
                      <AccordionTrigger className="p-0 flex-none" />
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            );
          }
        )}
      </div>
      <Link
        href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs leading-none ml-auto text-muted-foreground/80 -mt-0.5 flex items-center underline hover:no-underline tracking-wide"
      >
        See more on Scholar...
      </Link>
    </Section>
  );
};
