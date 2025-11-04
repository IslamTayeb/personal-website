import Image from 'next/image';
import { Header } from './_components/Header';
import { Hero } from './_components/Hero';
import { Spacing } from './_components/Misc/Spacing';
import { Summary } from './_components/Summary';
import { About } from './_components/About';
import { About2 } from './_components/About2';
import { Footer } from './_components/Footer';
import { Experience } from './_components/Experience';
import { Projects } from './_components/Projects';
import { Applets } from './_components/MiniProjects';
import { Skills } from './_components/Skills';
import { Contact } from './_components/Contact';
import { Publications } from './_components/Publications';
import { HAIP } from './_components/Icons/HAIP';

const height = 32;

export default function Home() {
  return (
    <main className="bg-background">
      <Header />

      <Spacing height={height} />

      <Hero />

      <Spacing height={height} />

      {/* <Summary />

      <Spacing height={height} /> */}

      {/* <About />

      <Spacing height={height} /> */}

      {/* <About2 />

      <Spacing height={height} /> */}

      <Experience />

      <Spacing height={height} />

      <Projects />

      <Spacing height={height} />

      <Applets />

      <Spacing height={height} />

      <Skills />

      <Spacing height={height} />

      <Publications />

      <Spacing height={height} />

      <Contact />

      <Spacing height={height} />

      <Footer />
    </main>
  );
}
