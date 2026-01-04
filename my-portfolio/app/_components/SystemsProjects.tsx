'use client';
import Link from 'next/link';
import { LucideGithub, FileText } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Section } from './Misc/Section';
import { Code, DefaultIcon } from './sharedComponents';

const categories = [
  { name: 'NETWORKING', color: 'bg-slate-400/40' },
  { name: 'OPERATING SYS', color: 'bg-slate-400/40' },
  { name: 'DISTRIBUTED', color: 'bg-slate-400/40' },
] as const;

const Tech = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <Code><DefaultIcon icon={icon} className="inline text-current" height="14px" /> {children}</Code>
);

const ExtLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">{children}</a>
);

export const SystemsProjects = () => {
  const systemsProjectsData = [
    {
      projectName: 'Evaluating Mosh\'s State Assumptions',
      new: false,
      wip: false,
      projectDescription: (
        <>
          Tested whether <ExtLink href="https://mosh.org/">Mosh</ExtLink>&apos;s use of &quot;assumed&quot; vs &quot;known&quot; server states holds under high packet loss. Built a <Tech icon="simple-icons:python">Python</Tech> SSP implementation with λ-parameterized reference selection and a <Tech icon="simple-icons:docker">Docker</Tech>/<Tech icon="simple-icons:linux">tc/netem</Tech> testbed to measure Age-of-Information.
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
          UDP networking for <ExtLink href="https://github.com/mit-pdos/xv6-riscv">xv6</ExtLink> in <Tech icon="simple-icons:c">C</Tech>: E1000 NIC driver with DMA descriptor rings and per-port packet queues. <Tech icon="simple-icons:python">Python</Tech> testbed for throughput/latency benchmarking under burst and sustained loads.
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
              <div className="flex items-center flex-wrap">
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
                <div className="flex gap-3 md:ml-auto">
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
