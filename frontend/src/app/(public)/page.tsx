import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/feature-section"; // Updated

import DemoSection from "@/components/landing/demo-section";
import HowItWorks from "@/components/landing/how-it-works";
import UseCaseMarquee from "@/components/landing/usecase-marque";
import PricingPage from "./pricing/page";


export default function Home() {
 
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero />
      <Features />
      <DemoSection />
      <UseCaseMarquee />
      <PricingPage/>
      <HowItWorks />
      
    </main>
  );
}
