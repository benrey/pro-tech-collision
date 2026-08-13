import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import Booth from "@/components/sections/Booth";
import ClosingCta from "@/components/sections/ClosingCta";
import Estimate from "@/components/sections/Estimate";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import ProofBar from "@/components/sections/ProofBar";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";

export default function Home() {
  return (
    <div className="edt" style={{ background: "var(--paper)" }}>
      <StructuredData />
      <div className="page-noise" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <ProofBar />
        <Services />
        <Booth />
        <Process />
        <Gallery />
        <Testimonials />
        <Visit />
        <Estimate />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
