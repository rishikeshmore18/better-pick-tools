import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { GamesStrip } from "@/components/GamesStrip";
import { ProblemSection } from "@/components/ProblemSection";
import { ValueSection } from "@/components/ValueSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { TrustSection } from "@/components/TrustSection";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <GamesStrip />
        <ProblemSection />
        <ValueSection />
        <HowItWorks />
        <Pricing />
        <TrustSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
