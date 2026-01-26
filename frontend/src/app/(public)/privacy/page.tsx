"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Server, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-20">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 relative z-10">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary group text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Vystra
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Transparency on how we handle your video data.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-widest font-medium">
              Last Updated: January 26, 2026
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm">
          
          {/* Beta Warning Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 mb-10 flex gap-4 items-start">
            <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Portfolio & Beta Mode</h3>
              <p className="text-blue-600/80 dark:text-blue-400/80 text-sm mt-1 leading-relaxed">
                Vystra is currently operating in a public beta for portfolio demonstration. 
                Data uploaded during this phase may be periodically wiped for maintenance. 
                Please avoid uploading sensitive personal documents.
              </p>
            </div>
          </div>

          <article className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none">
            
            <Section 
              icon={<Eye className="w-5 h-5" />}
              title="1. Data Collection"
            >
              <p>
                We collect limited data to provide the video analysis service. This includes your authentication details 
                (via Clerk/NextAuth), the video files you upload, and usage metrics (like which features you use most).
              </p>
            </Section>

            <Section 
              icon={<Server className="w-5 h-5" />}
              title="2. How We Use Data"
            >
              <p>
                We process your videos using AI to generate transcripts and insights. 
                <strong>We do not sell your data.</strong> Your information is strictly used to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                <li>Provide the core analysis features.</li>
                <li>Improve AI accuracy (in anonymized batches).</li>
                <li>Process subscription payments (via Stripe).</li>
              </ul>
            </Section>

            <Section 
              icon={<Lock className="w-5 h-5" />}
              title="3. Security & Storage"
            >
              <p>
                Your files are stored in <strong>AWS S3</strong> buckets with strict access controls. 
                Transcripts are encrypted at rest in our database. While we implement industry-standard security, 
                remember that no method of transmission over the internet is 100% secure.
              </p>
            </Section>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-4">Contact & Data Deletion</h3>
              <p className="text-muted-foreground">
                You have the right to request full deletion of your account and data. 
                Please reach out to us at <a href="mailto:privacy@vystra.ai">privacy@vystra.ai</a>.
              </p>
            </div>

          </article>
        </div>
      </div>
    </div>
  );
}

// Helper Component for consistent spacing
function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="mb-10 group">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-foreground m-0 border-none">{title}</h2>
      </div>
      <div className="text-muted-foreground leading-relaxed pl-1">
        {children}
      </div>
    </div>
  );
}