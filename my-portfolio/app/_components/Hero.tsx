'use client'
import { ComponentPropsWithoutRef } from 'react'
import { MoonIcon } from './Icons/MoonIcon'
import { Section } from './Section'
import { Typewriter, Cursor } from "react-simple-typewriter"
import { cn } from '@/lib/utils'

const Code = ({className,...props}: ComponentPropsWithoutRef<"span">) => {
    return <span className={cn("bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono",className)} {...props} />
}

export const Hero = () => {
    return <Section className='flex max-md:flex-col items-start gap-3'>
        {/* replace md with lg if you remove the cresent */}
        <div className='flex-[2] flex flex-col gap-0.5'>
            <h2 className='font-caption font-semibold text-5xl text-primary'>Islam Tayeb</h2>
            <h3 className='font-caption font-medium text-2xl'>I'm a <Typewriter words={['Software Developer', 'Research Analyst', 'Graphic Designer']} cursor typeSpeed={50} loop={0} deleteSpeed={40} delaySpeed={2250} /></h3>
            <p className='font-sans basis-0'>Lorem ipsum dolor sit <Code>Youtube</Code> amet, consectetur adipiscing elit. Donec luctus mi eu sapien placerat, nec suscipit tellus rutrum. Sed sollicitudin mi.</p>
        </div>
        <div className='flex-1 p-5 m-auto'>
            <MoonIcon className="w-full h-auto max-w-xs" />
        </div>
    </Section>
}
