'use client';
import Link from 'next/link';
import { LucideGithub, FileText } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Section } from './Misc/Section';
import { Code, DefaultIcon } from './sharedComponents';

const categories = [
  { name: 'NETWORKING', color: 'bg-slate-400/40' },
  { name: 'OPERATING SYSTEM', color: 'bg-slate-400/40' },
  { name: 'DISTRIBUTED', color: 'bg-slate-400/40' },
] as const;

export const SystemsProjects = () => {
  const systemsProjectsData = [
    {
      projectName: 'Evaluating Mosh\'s State Assumptions',
      new: true,
      wip: false,
      projectDescription: (
        <>
          <a
            href="https://mosh.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            Mobile Shell
          </a>{' '}
          (Mosh) uses &quot;assumed&quot; over &quot;known&quot; server states as reference for when to send packets. We tested whether this assumption holds under varying network conditions. Built a{' '}
          <Code>
            <DefaultIcon icon="simple-icons:python" className="inline text-current" height="14px" /> Python
          </Code>{' '}
          SSP implementation with λ-parameterized reference selection and a{' '}
          <Code>
            <DefaultIcon icon="simple-icons:docker" className="inline text-current" height="14px" /> Docker
          </Code>{' '}
          testbed with{' '}
          <Code>
            <DefaultIcon icon="simple-icons:linux" className="inline text-current" height="14px" /> tc/netem
          </Code>{' '}
          to measure AoI under high packet loss.

          {/* Built with{' '}
          <a href="https://www.linkedin.com/in/arvindh-manian/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Arvindh</a>,{' '}
          <a href="https://www.linkedin.com/in/aaaronhsu/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Aaron</a>,{' '}
          <a href="https://www.linkedin.com/in/john-schappert/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">John</a>, and{' '}
          <a href="https://www.linkedin.com/in/mimi-liao/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Mimi</a>! */}
        </>
      ),
      projectExternalLinks: {
        github: 'https://github.com/IslamTayeb/mosh-lite',
        paper: 'https://github.com/IslamTayeb/mosh-lite/blob/main/final_report.pdf',
      },
      category: categories[0],
    },
    {
      projectName: 'xv6 Network Stack',
      new: false,
      wip: false,
      projectDescription: (
        <>
          Full UDP networking for{' '}
          <a
            href="https://github.com/mit-pdos/xv6-riscv"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            xv6
          </a>
          {' '}in{' '}
          <Code>
            <DefaultIcon icon="simple-icons:c" className="inline text-current" height="14px" /> C
          </Code>

          : E1000 NIC driver with DMA-based TX/RX descriptor rings and UDP protocol layer with per-port queues. Built a{' '}
          <Code>
            <DefaultIcon icon="simple-icons:python" className="inline text-current" height="14px" /> Python
          </Code>{' '}
          testbed with binary search for max throughput, queue depth monitoring across burst/sustained loads, and latency analysis.
        </>
      ),
      projectExternalLinks: {
        github: 'https://github.com/islamtayeb/xv6-networking-project',
        paper: 'https://github.com/IRSMsoso/xv6-networking-project/blob/main/final_report.pdf',
      },
      category: categories[1],
    },
  ];

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={'outline'} className="mb-4" id="systems">
        Systems Projects
      </Badge>

      <div className="flex flex-col gap-6">
        {systemsProjectsData.map((project) => (
          <div key={project.projectName} className="flex">
            {/* Side Tab */}
            <div
              className={`w-7 rounded-l-lg flex items-center justify-center shrink-0 ${project.category.color}`}
            >
              <span className="text-[10px] font-semibold text-white/90 [writing-mode:vertical-lr] rotate-180 tracking-wider font-mono">
                {project.category.name}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 border-y border-r border-border/80 hover:border-border border-dashed rounded-r-lg p-3 py-2 bg-card hover:bg-card/50 transition-colors flex flex-col">
              {/* Title and badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-medium text-primary">
                  {project.projectName}
                </h3>
                {project.new && (
                  <Badge
                    variant="default"
                    className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono leading-tight"
                  >
                    New
                  </Badge>
                )}
                {project.wip && (
                  <Badge
                    variant="secondary"
                    className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono leading-tight"
                  >
                    WIP
                  </Badge>
                )}
                <div className="ml-auto flex gap-3">
                  {project.projectExternalLinks?.paper && (
                    <Link
                      href={project.projectExternalLinks.paper}
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText size={14} />
                      Report
                    </Link>
                  )}
                  {project.projectExternalLinks?.github && (
                    <Link
                      href={project.projectExternalLinks.github}
                      className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground underline hover:no-underline transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LucideGithub size={14} />
                      GitHub
                    </Link>
                  )}
                </div>
              </div>

              {/* Description with integrated skills */}
              <p className="text-muted-foreground font-normal text-base font-sans">
                {project.projectDescription}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end w-full">
        <Link
          href="https://github.com/IslamTayeb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs leading-none text-muted-foreground/80 mt-3 flex items-center underline hover:no-underline font-mono tracking-wide"
        >
          See more on GitHub...
        </Link>
      </div>
    </Section>
  );
};
