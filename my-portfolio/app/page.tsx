import Image from "next/image";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Spacing } from "./_components/Misc/Spacing";
import { Status } from "./_components/Status";
import { Skills } from "./_components/Skills";
import { Footer } from "./_components/Footer";
import { Experience } from "./_components/Experience";
import { Projects } from "./_components/Projects";

export default function Home() {
  return (
    <main>
      <Header />

      <Spacing height={40} />

      <Hero />

      <Spacing height={40} />

      <Status />

      <Spacing height={40} />

      <Skills />

      <Spacing height={40} />

      <Experience />

      <Spacing height={40} />

      <Projects />

      <Spacing height={40} />

      <Footer />
    </main>
  );
}
