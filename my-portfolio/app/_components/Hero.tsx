/* eslint-disable react/no-unescaped-entities */
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
        {/* gap is for the gap between the cresent and the text */}
        {/* replace md with lg if you remove the cresent */}
        <div className='flex-[4] flex flex-col gap-0.5'>
            <h2 className='font-caption font-semibold text-5xl text-primary'>Islam Tayeb</h2>
            <h3 className='font-caption font-medium text-2xl'>I'm a <Typewriter words={['Software Developer', 'Research Analyst', 'Graphic Designer']} cursor typeSpeed={50} loop={0} deleteSpeed={40} delaySpeed={2250} /></h3>
            <p className='font-sans basis-0 text-muted-foreground'>Sunt magna labore veniam laboris amet enim magna sit ad. Aliquip nulla do consequat occaecat ea aliqua quis elit. Proident proident reprehenderit reprehenderit sunt et elit irure quis qui ea deserunt ipsum. Eu anim ea cupidatat nisi reprehenderit incididunt.</p>
        </div>
        <div className='flex-[2.25] p-5 m-auto'>
            <MoonIcon className="w-full h-auto max-w-xs max-md:w-56 ml-auto" />
        </div>
    </Section>
}
