/* eslint-disable @next/next/no-img-element */
import { Card } from '@/components/ui/card'
import React from 'react'
import { Section } from './Section'
import { ArrowUpRight, Atom, Binary, Cpu, LucideIcon, Mail, Radiation, ScanEye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// =======================================================================

export const Status = () => {
    return (
        
        <Section className='flex max-md:flex-col items-start gap-4'>
            {/*<Badge variant={"outline"}>Summary</Badge> */}
            <Card className='font-sans font-medium flex-[3] w-full flex flex-col h-full gap-2 p-4'><p className="text-lg text-muted-foreground">Professional Experience</p>
            <div className='flex flex-col gap-3'>
                    {WORKS.map((work, index) => (
                        <Work
                            key={index}
                            image={work.image}
                            title={work.title}
                            role={work.role}
                            date={work.date}
                            url={work.url}
                        />
                    ))}
                </div>
            </Card>
            <div className='flex-[2] w-full flex flex-col h-full gap-4'>
                <Card className='font-sans font-medium flex-1 p-4'><p className="text-lg text-muted-foreground">Featured Projects</p>
                    <div className='flex flex-col gap-2 pt-2'>
                        {SIDE_PROJECTS.map((project, index) => 
                            <SideProject
                            key={index}
                            Logo={project.Logo}
                            title={project.title}
                            description={project.description}
                            url={project.url}/>
                        )}
                    </div>
                </Card>
                <Card className='font-sans font-medium flex-1 p-4 text-muted-foreground'><p className="text-lg text-muted-foreground">Contact</p>
                <div className='flex flex-col gap-2 pt-2'>
                        {CONTACT.map((contact, index) => 
                            <Contact
                            key={index}
                            Logo={contact.Logo}
                            title={contact.title}
                            description={contact.description}
                            url={contact.url}/>
                        )}
                    </div>
                </Card>
            </div>
        </Section>
    );
};

// =======================================================================

const SIDE_PROJECTS: SideProjectProps[] = [
    {
        Logo: Binary,
        title: "Medical Imaging",
        description: "ML & Computer Vision",
        url: "/"
    },
    {
        Logo: Atom,
        title: "2D Bin Packing",
        description: "Algorithm Engineering",
        url: "/"
    },
    {
        Logo: ScanEye,
        title: "CNT Biosensors",
        description: "Athletic Medical Device",
        url: "/"
    }
]

type SideProjectProps = {
    Logo: LucideIcon;
    title: string;
    description: string
    url: string;
}

const SideProject = (props: SideProjectProps) => {
    return (
    <Link href={props.url} className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-0.5 px-2.5 rounded">
            <span className='bg-accent text-accent-foreground p-3 rounded-sm'>
                <props.Logo size={16}/>
            </span>
            
            <div>
                <div className="text-lg font-semibold">{props.title}</div>
                <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>
    </Link>
    );
}

// =======================================================================

const WORKS: WorkProps[] = [
    {
        image: "https://media.licdn.com/dms/image/D560BAQEVg2G3NGXgmw/company-logo_100_100/0/1692466480465/dukeinnovate_logo?e=1724284800&v=beta&t=mSxP_TqfLsPOm_ZXriZ4-dpIVb6POA7U5pbH-4flel0",
        title: "Inst. for Health Innovation",
        role: "Research Analyst",
        date: "2024 - Present",
        url: "/"
    },
    {
        image: "https://financial-aid-files.cloud.duke.edu/sites/default/files/styles/focal_point_large/public/Duke%20garamond%20300x300%20for%20staff%20profile%20pic-01.png?h=e009a64d&itok=lD6LYOQ8",
        title: "Duke University",
        role: "Research Assistant @ Feng Labs",
        date: "2023 - Present",
        url: "/"
    },
    {
        image: "https://media.licdn.com/dms/image/D4E0BAQGoQWtvjZAWbg/company-logo_100_100/0/1701588957384?e=1724284800&v=beta&t=0YW-cC6AuH32pc4lHtJvcCdZA_ttcutmd8CGqR74uSY",
        title: "Project Sapien",
        role: "Software Engineer",
        date: "2023 - 2024",
        url: "/"
    },
    {
        image: "https://media.licdn.com/dms/image/C560BAQFjHNUub2MPHA/company-logo_100_100/0/1631328654457?e=1724284800&v=beta&t=62U-7YNMjaN_qj-yndQwQhBgdV18UHVpPofcqWi74h0",
        title: "Saudi Aramco",
        role: "Research Assistant @ CCUS Labs",
        date: "2022 - 2023",
        url: "/"
    },
    {
        image: "https://media.licdn.com/dms/image/C560BAQH8FNoYbuVixQ/company-logo_100_100/0/1631305310418?e=1724284800&v=beta&t=tn3vB1O_jYRSuwaW4iepd-oFhp5OouGPuUnG9J88j2M",
        title: "King Abdulaziz University",
        role: "Research Assistant @ Biotech Dept.",
        date: "2021 - 2022",
        url: "/"
    },
]

type WorkProps = {
    image: string;
    title: string;
    role: string;
    date: string;
    url: string;
}

const Work = (props: WorkProps) => {
    return (
        <Link href={props.url} className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-0.5 px-2.5 rounded">
                    <img src={props.image} alt={props.title} className='w-9 h-9 object-contain rounded-sm'/>
                
                <div>
                    <div className="text-lg font-semibold">{props.title}</div>
                    <p className="text-sm text-muted-foreground">{props.role}</p>
                </div>

                <div className='ml-auto'>
                <p className="text-xs text-muted-foreground">{props.date}</p>
                </div>
        </Link>
    );
}

// =======================================================================

const CONTACT: ContactProps[] = [
    {
        Logo: Mail,
        title: "Email",
        description: "imt11@duke.edu",
        url: "mailto:imt11@duke.edu"
    }
]

type ContactProps = {
    Logo: LucideIcon;
    title: string;
    description: string
    url: string;
}

const Contact = (props: ContactProps) => {
    return (
        <Link href={props.url} className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-0.5 px-2.5 rounded">
        <span className='bg-accent text-accent-foreground p-3 rounded-sm'>
            <props.Logo size={16}/>
            </span>
            
            <div>
                <div className="text-lg font-semibold">{props.title}</div>
                <p className="text-sm text-muted-foreground">{props.description}</p>
            </div>

            <div className='ml-auto'>
                <ArrowUpRight size={16} className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform" />
            </div>
    </Link>
    );
}