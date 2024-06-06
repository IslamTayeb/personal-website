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

      <Spacing height={50} />

      <Hero />

      <Spacing height={50} />

      <Status />

      <Spacing height={50} />

      <Skills />

      <Spacing height={50} />

      <Experience />

      <Spacing height={50} />

      <Projects />

      <Spacing height={50} />

      <Footer />
    </main>
  );
}
