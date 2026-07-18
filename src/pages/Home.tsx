import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { CustomSections } from "@/components/CustomSections";
import { Gallery } from "@/components/Gallery";
import { Posts } from "@/components/Posts";
import { Contact, Footer } from "@/components/Contact";

function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <CustomSections />
      <Gallery />
      <Posts />
      <Contact />
      <Footer />
    </main>
  );
}

export default Home;
