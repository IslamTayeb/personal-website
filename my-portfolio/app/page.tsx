import { Header } from './_components/Header';
import { Hero } from './_components/Hero';
import { Spacing } from './_components/Misc/Spacing';
import { Footer } from './_components/Footer';
import { Experience } from './_components/Experience';
import { Projects } from './_components/Projects';
import { Applets } from './_components/Applets';
import { Contact } from './_components/Contact';
import { Publications } from './_components/Publications';

const height = 32;

export default function Home() {
  return (
    <main className="bg-background">
      <Header />

      <Spacing height={height} />

      <Hero />

      <Spacing height={height} />

      <Experience />

      <Spacing height={height} />

      <Projects />

      <Spacing height={height} />

      <Applets />

      <Spacing height={height} />

      <Publications />

      <Spacing height={height} />

      <Contact />

      <Spacing height={height} />

      <Footer />
    </main>
  );
}
