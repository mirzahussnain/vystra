"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, Linkedin, Twitter, Code2, Cpu, Globe, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 relative z-10">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary group text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Vystra
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            The Story Behind <strong className="text-primary">Vystra</strong>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bridging the gap between raw video data and actionable intelligence using modern AI infrastructure.
          </p>
        </div>

        {/* The "Developer" Card (Glassmorphism) */}
        <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* 1. YOUR AVATAR (Pulled from GitHub) */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-background bg-muted">
                <Image 
                  src="https://github.com/mirzahussnain.png" 
                  alt="Hussnain Ali"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 2. YOUR INFO */}
            <div className="text-center md:text-left space-y-4 flex-1">
              <div>
                <Badge variant="outline" className="mb-2 border-primary/20 text-primary bg-primary/5">Lead Developer</Badge>
                <h2 className="text-3xl font-bold">Hussnain Ali</h2>
                <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase mt-1">
                  Full Stack Engineer &amp; AI Architect
                </p>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
                Hi, I&apos;m Hussnain. I built Vystra to demonstrate the power of <strong className="text-primary font-semibold">Event-Driven Architecture</strong> combined with <strong className="text-primary font-semibold">Large Language Models</strong>. 
                My focus is on building scalable, production-ready applications that solve complex data problems with <strong className="text-primary font-semibold">clean, maintainable code</strong>.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                <Link href="https://github.com/mirzahussnain" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all">
                    <Github className="w-5 h-5" />
                  </Button>
                </Link>
                {/* Update these if you have specific URLs, otherwise they are placeholders */}
                <Link href="https://www.linkedin.com/in/hussnain-ali-202738191/" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="https://x.com/Hussy23king3" target="_blank">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-500/10 hover:text-sky-500 hover:border-sky-500/50 transition-all">
                    <Twitter className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* The Tech Stack (Grid) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Stack Item 1 */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Modern Frontend</h3>
            <p className="text-sm text-muted-foreground">
              Built with <strong className="text-primary">Next.js 14</strong>, utilizing Server Components for speed and <strong className="text-primary">Tailwind CSS v4</strong> for a sleek, responsive UI.
            </p>
          </div>

          {/* Stack Item 2 */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Robust Backend</h3>
            <p className="text-sm text-muted-foreground">
              Powered by <strong className="text-primary">FastAPI</strong> for high-performance async endpoints and <strong className="text-primary">PostgreSQL</strong> for reliable data storage.
            </p>
          </div>

          {/* Stack Item 3 */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Asynchronous Workers</h3>
            <p className="text-sm text-muted-foreground">
              Video processing is handled by <strong className="text-primary">Celery &amp; Redis</strong> workers, ensuring the UI remains snappy even during heavy loads.
            </p>
          </div>

          {/* Stack Item 4 */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Integration</h3>
            <p className="text-sm text-muted-foreground">
              Leveraging <strong className="text-primary">OpenAI</strong> and <strong className="text-primary">FFmpeg</strong> to transcribe audio and generate actionable business insights automatically.
            </p>
          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            Designed &amp; Developed by <strong className="text-foreground">Hussnain Ali</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}