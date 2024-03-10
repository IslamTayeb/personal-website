"use client"

import React, { useEffect, useRef, useLayoutEffect } from 'react'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import useScroll from '@/hooks/use-scroll'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import gsap from 'gsap'
import { Power2 } from 'gsap';
import 'gsap';

const Header = () => {
    const menuToggle = useRef(null);
  
    useLayoutEffect(() => {
      const menuBar = gsap.timeline();
  
      menuBar.to('.bar-1', 0.5, {
        attr: { d: "M8,2 L2,8" },
        x: 1,
        ease: Power2.easeInOut
      }, 'start')
  
      menuBar.to('.bar-2', 0.5, {
        autoAlpha: 0
      }, 'start')
  
      menuBar.to('.bar-3', 0.5, {
        attr: { d: "M8,8 L2,2" },
        x: 1,
        ease: Power2.easeInOut
      }, 'start')
  
      menuBar.reverse();
  
      const tl = gsap.timeline({ paused: true });
  
      tl.to('.fullpage-menu', {
        duration: 0,
        display: "block",
        ease: 'Expo.easeInOut',
      });
  
      tl.from('.menu-bg span', {
        duration: 1,
        x: "100%",
        stagger: 0.1,
        ease: 'Expo.easeInOut'
      });
  
      tl.from('.main-menu li a', {
        duration: 1.5,
        y: "100%",
        stagger: 0.2,
        ease: 'Expo.easeInOut'
      }, "-=0.5");
  
      tl.from('.social-links li', {
        duration: 1,
        y: "-100%",
        opacity: 0,
        stagger: 0.1,
        ease: 'Expo.easeInOut'
      }, "-=0.5");
  
      tl.reverse();
    }, []);

    return (
        <header>
            <div className="header-row">
                <button className="menu-toggle" id="menuToggle">
                    <svg viewBox="0 0 19 100" className="hamburger" height="150px" width="40px">
                        <path d="M2,90 L2,2" className="bar-1"></path>
                        <path d="M9,90 L9,2" className="bar-2"></path>
                        <path d="M16,90 L16,2" className="bar-3"></path>
                    </svg>  
                </button>
            </div>

            {/* <div className="white-bar"></div> */}

        <section className="fullpage-menu">
            <div className="fullpage-menu-inner">
                <div className="menu-bg">
                    <span></span>
                </div>

                <nav>
                    <ul className="main-menu">
                        <li><a href="">Home</a></li>
                        <li><a href="">About</a></li>
                        <li><a href="">Work</a></li>
                        <li><a href="">Contact</a></li>
                    </ul>
                </nav>

                <div className="header-nav-footer">
                    <ul className="social-links">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li>&copy;2021</li>
                    </ul>
                </div>

            </div>
        </section>
        
    </header>
    
    )

}

export default Header