"use client";

import Logo  from "@/components/ui/logo";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { LogoV } from "../ui/logo-vystra";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-2">
            <div className="flex items-center -gap-1">
              <LogoV className="max-w-16" />
              <span className="font-bold text-xl tracking-tight">ystra</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed -mt-6">
              Unlock the knowledge hidden in your video library. 
              Search, analyze, and summarize instantly.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="https://x.com/Hussy23king3" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://github.com/mirzahussnain" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/hussnain-ali-202738191/" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#working" className="hover:text-primary transition-colors">Demo</Link></li>
              {/*<li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Docs</Link></li>*/}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              {/*<li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>*/}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms&conditions" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              {/*<li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>*/}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vystra Inc. All rights reserved.
          </p>
          
          {/* "System Status" Indicator - A nice Pro touch */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;