import { Header } from './_components/Header';
import { Hero } from './_components/Hero';
import { Spacing } from './_components/Misc/Spacing';
import { Footer } from './_components/Footer';
import { Experience } from './_components/Experience';
import { ProductProjects } from './_components/ProductProjects';
import { SystemsProjects } from './_components/SystemsProjects';
import { Applets } from './_components/Applets';
import { Contact } from './_components/Contact';
import { Publications } from './_components/Publications';
import { Blog } from './_components/Blog';
import { Courses } from './_components/Courses';

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

      <ProductProjects />

      <Spacing height={height} />

      <SystemsProjects />

      <Spacing height={height} />

      <Applets />

      <Spacing height={height} />

      <Publications />

      <Spacing height={height} />

      <Blog />

      <Spacing height={height} />

      <Courses />

      <Spacing height={height} />

      <Contact />

      <Spacing height={height} />

      <Footer />
    </main>
  );
}
