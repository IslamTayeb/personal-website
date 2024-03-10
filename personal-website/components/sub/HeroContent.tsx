'use client'

import React from 'react'
import {motion} from 'framer-motion'
import { slideInFromBottom, slideInFromLeft, slideInFromTop } from '@/lib/motion'
import localFont from 'next/font/local'

const herocontent = () => {
  return (
    <motion.div
    initial="hidden"
    animate="visible"
    className='flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]'>
        <div className='h-full w-full flex flex-col gap-5 justify-center m-auto text-start'>
            <motion.div
            variants={slideInFromBottom}
            className='Welcome-box py-[5px] px-[6px] border border-[#7042f88b] opacity-[0.8]'>
                <h1 className='Welcome-text text-[#b49bff] font-bold text-s'>
                  Welcome to my personal website
                </h1>
            </motion.div>

            <motion.div
            variants={slideInFromLeft(0.5)}
            className='Name-box py-[5px] px-[6px] border border-[#7042f88b] opacity-[0.8]'>
                <h1 className='Name-text text-[#f1e9da] font-bold text-xl'>
                  Islam Tayeb
                </h1>
            </motion.div>
        </div>
    </motion.div>
  )
}

export default herocontent