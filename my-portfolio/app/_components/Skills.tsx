import React, { ComponentPropsWithoutRef } from 'react'
import { Section } from './Misc/Section'
import { Polymer } from './Icons/Polymer'
import { Medtech } from './Icons/Medtech'
import { cn } from '@/lib/utils'
import { SWEIcon } from './Icons/SWEIcon'
import { Badge } from '@/components/ui/badge'

const Code = ({className,...props}: ComponentPropsWithoutRef<"span">) => {
    return <span className={cn("bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono",className)} {...props} />
}

export const Skills = () => {
    return (
        <Section className='flex flex-col items-start gap-4'>
            <Badge variant={"outline"}>Summary</Badge>
            <h2 className="pb-2 text-3xl font-semibold font-sans first:mt-0 text-primary">
                I love working on...
            </h2>

            <div className='flex max-md:flex-col gap-4'>
                <div className="flex flex-col gap-2">
                    <Polymer size={54}/>
                    <h3 className="text-2xl font-medium font-sans">Polymer Research</h3>
                    <p className="text-sm text-muted-foreground font-sans">Plan it, create it, launch it. <Code>Huggingface API</Code> Collaborate seamlessly with all  the organization and hit your marketing goals every month with our marketing plan.</p>
                </div>

                <div className="flex flex-col gap-2">
                    <Medtech size={54}/>
                    <h3 className="text-2xl font-medium font-sans">Medical Technology</h3>
                    <p className="text-sm text-muted-foreground font-sans">Plan it, create it, launch it. <Code>Huggingface API</Code> Collaborate seamlessly with all  the organization and hit your marketing goals every month with our marketing plan.</p>
                </div>

                <div className="flex flex-col gap-2">
                    <SWEIcon size={54}/>

                    <h3 className="text-2xl font-medium font-sans">Software Dev</h3>

                    <p className="text-sm text-muted-foreground font-sans">Plan it, create it, launch it. <Code>Huggingface API</Code> Collaborate seamlessly with all  the organization and hit your marketing goals every month with our marketing plan.</p>
                </div>
            </div>
        </Section>
    )
}
