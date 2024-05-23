import Image from "next/image";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Spacing } from "./_components/Spacing";
import { Status } from "./_components/Status";
import { Skills } from "./_components/Skills";
import { Footer } from "./_components/Footer";

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

      <Footer />
    </main>
  );
}
