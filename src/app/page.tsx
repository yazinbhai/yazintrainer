import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Authority } from "@/components/sections/Authority";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Methodology } from "@/components/sections/Methodology";
import { Gallery } from "@/components/sections/Gallery";
import { Blog } from "@/components/sections/Blog";
import { Consultation } from "@/components/sections/Consultation";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Problem />
        <Authority />
        <Services />
        <Testimonials />
        <Methodology />
        <Gallery />
        <Blog />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
