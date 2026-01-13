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
import MobileNav from "@/components/landing/mobile-nav";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}

      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Left: Logo (Desktop) OR Mobile Menu (Mobile) */}
          <div className="flex items-center gap-4">
            {/* MOBILE NAV */}
            <MobileNav />

            {/* Logo Link */}
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl tracking-tight text-foreground">
                Insight<span className="text-primary">Stream</span>
              </span>
            </Link>
          </div>

          {/* Middle: Navigation Links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How it Works
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Docs
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/dashboard">
              <Button
                size="sm"
                className="hidden sm:flex font-semibold shadow-lg shadow-primary/20"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Hero />
      <DemoSection />
      <BentoGrid />
      <UseCaseMarquee />
      <HowItWorks />
      <Footer />
    </main>
  );
}
