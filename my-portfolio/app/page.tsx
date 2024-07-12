import Image from "next/image";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Spacing } from "./_components/Misc/Spacing";
import { Summary } from "./_components/Summary";
import { About } from "./_components/About";
import { Footer } from "./_components/Footer";
import { Experience } from "./_components/Experience";
import { Projects } from "./_components/Projects";
import { Skills } from "./_components/Skills";
import { Contact } from "./_components/Contact";
import { Publications } from "./_components/Publications";
import { HAIP } from "./_components/Icons/HAIP";

export default function Home() {
  return (
    <main>
      <Header />

      <Spacing height={40} />

      <Hero />

      <Spacing height={40} />

      {/* <Summary />

      <Spacing height={40} /> */}

      <About />

      <Spacing height={40} />

      <Experience />

      <Spacing height={40} />

      <Projects />

      <Spacing height={40} />

      <Skills />

      <Spacing height={40} />

      <Publications />

      <Spacing height={40} />

      <Contact />

      <Spacing height={40} />

      <Footer />
    </main>
  );
}
