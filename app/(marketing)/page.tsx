import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { BookCovers } from "@/components/landing/BookCovers";
import { Preview } from "@/components/landing/Preview";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { ScrollAnimations } from "@/components/ui/ScrollAnimations";
import { AuthRedirect } from "@/components/landing/AuthRedirect";

export default function Home() {
  return (
    <>
      <AuthRedirect />
      <ScrollAnimations />
      <Nav />
      <main id="main">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <Features />
        <BookCovers />
        <Preview />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
