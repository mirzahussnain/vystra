import { Hero } from "@/components/landing/Hero";
import { BentoGrid } from "@/components/landing/bento-grid"; // Updated
import Logo from "@/components/ui/logo";
import ModeToggle from "@/components/ui/theme-toggler";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DemoSection from "@/components/landing/demo-section";
import HowItWorks from "@/components/landing/how-it-works";
import UseCaseMarquee from "@/components/landing/usecase-marque";
import Footer from "@/components/landing/footer";
import MobileNav from "@/components/global/mobile-nav";
import { MobileNavProps } from "@/lib/types";

export default function Home() {
 
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero />
      <DemoSection />
      <BentoGrid />
      <UseCaseMarquee />
      <HowItWorks />
      
    </main>
  );
}
