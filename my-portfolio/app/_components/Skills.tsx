import React from 'react';
import { Section } from './Misc/Section';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@iconify/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Code, DefaultIcon } from './sharedComponents';
import { Pinecone } from './Icons/Pinecone';

export const Skills = () => {
  type Technology = {
    name: string;
    icon: string;
    component?: React.ComponentType<{ size?: number; className?: string }>;
  };

  const skillsData: {
    category: React.ReactNode;
    technologies: Technology[];
  }[] = [
    {
      category: 'Languages',
      technologies: [
        { name: 'TypeScript', icon: 'akar-icons:typescript-fill' },
        { name: 'JavaScript', icon: 'akar-icons:javascript-fill' },
        { name: 'Python', icon: 'akar-icons:python-fill' },
        { name: 'Java', icon: 'fa6-brands:java' },
        { name: 'C++', icon: 'simple-icons:cplusplus' },
        { name: 'SQL', icon: 'fa-solid:database' },
        { name: 'R', icon: 'devicon-plain:r' },
        { name: 'HTML', icon: 'simple-icons:html5' },
        { name: 'CSS', icon: 'simple-icons:css3' },
      ],
    },
    {
      category: <>Frameworks&nbsp;& Libraries</>,
      technologies: [
        { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
        { name: 'React', icon: 'akar-icons:react-fill' },
        { name: 'Flask', icon: 'simple-icons:flask' },
        { name: 'FastAPI', icon: 'simple-icons:fastapi' },
        { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
        { name: 'PyTorch', icon: 'simple-icons:pytorch' },
        { name: 'LangChain', icon: 'simple-icons:langchain' },
        { name: 'AutoGen', icon: 'cib:microsoft' },
      ],
    },
    {
      category: <>Infrastructure&nbsp;& Tools</>,
      technologies: [
        { name: 'AWS', icon: 'cib:amazon-aws' },
        { name: 'GCP', icon: 'cib:google-cloud' },
        { name: 'Docker', icon: 'simple-icons:docker' },
        { name: 'Unix/Linux', icon: 'devicon-plain:linux' },
        { name: 'Redis', icon: 'devicon-plain:redis' },
        { name: 'PostgreSQL', icon: 'akar-icons:postgresql-fill' },
        { name: 'Pinecone', icon: 'custom', component: Pinecone },
        { name: 'Prisma', icon: 'simple-icons:prisma' },
        { name: 'SQLAlchemy', icon: 'devicon-plain:sqlalchemy' },
        { name: 'Selenium', icon: 'simple-icons:selenium' },
      ],
    },
  ];

  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={'outline'} className="" id="skills">
        Technical Skills
      </Badge>

      <div className="w-full">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-1/6 font-extrabold text-foreground">
                Category
              </TableHead>
              <TableHead className="text-left w-5/6 font-extrabold text-foreground">
                Technologies
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-accent-foreground">
            {skillsData.map((skillCategory, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-muted-foreground">
                  {skillCategory.category}
                </TableCell>
                <TableCell className="flex gap-3">
                  {skillCategory.technologies.map((tech) => (
                    <TooltipProvider key={tech.name} delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-1 relative group">
                            {tech.icon === 'custom' && tech.component ? (
                              <>
                                <tech.component
                                  className="group-hover:blur-[6px] absolute transition-all opacity-35"
                                  size={36}
                                />
                                <tech.component
                                  className="relative"
                                  size={36}
                                />
                              </>
                            ) : (
                              <>
                                <Icon
                                  className="group-hover:blur-[6px] absolute transition-all opacity-35"
                                  icon={tech.icon}
                                  width="2.25em"
                                  height="2.25em"
                                />
                                <Icon
                                  className="relative"
                                  icon={tech.icon}
                                  width="2.25em"
                                  height="2.25em"
                                />
                              </>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{tech.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
};
