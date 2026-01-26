"use client";

import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, FileText, Ban, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-20">
      {/* Background Gradient Blob - Slightly different position */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />

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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-black dark:from-slate-700 dark:to-slate-900 flex items-center justify-center shadow-lg shrink-0 border border-white/10">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              The rules defining the use of Vystra's platform.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-widest font-medium">
              Last Updated: January 26, 2026
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm">
          
          {/* As-Is Warning Banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-10 flex gap-4 items-start">
            <div className="p-2 bg-amber-500/20 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-300 text-sm">"As Is" Disclaimer</h3>
              <p className="text-amber-600/80 dark:text-amber-400/80 text-sm mt-1 leading-relaxed">
                During this Beta phase, the service is provided "as is" and "as available" without warranties of any kind regarding uptime or data persistence.
              </p>
            </div>
          </div>

          <article className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-primary max-w-none">
            
            <Section 
              icon={<FileText className="w-5 h-5" />}
              title="1. Agreement to Terms"
            >
              <p>
                By creating an account or uploading video content to Vystra, you agree to these Terms. 
                If you do not agree, you must discontinue use immediately. We reserve the right to modify these terms 
                as we transition from Beta to full release.
              </p>
            </Section>

            <Section 
              icon={<Zap className="w-5 h-5" />}
              title="2. Service Description"
            >
              <p>
                Vystra is an AI-powered video analysis tool. We offer limited free access for demonstration purposes 
                and premium tiers for heavy usage.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                <li><strong>Free Tier:</strong> Subject to strict usage limits (e.g., 15-minute videos).</li>
                <li><strong>Premium Tier:</strong> Paid subscriptions are non-refundable after 7 days.</li>
              </ul>
            </Section>

            <Section 
              icon={<Ban className="w-5 h-5" />}
              title="3. Prohibited Conduct"
            >
              <p>
                You retain ownership of your content, but you agree NOT to upload:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
                <li>Material that violates copyright or intellectual property laws.</li>
                <li>Content that is illegal, violent, or explicitly pornographic.</li>
                <li>Malware or files designed to disrupt our infrastructure.</li>
              </ul>
              <p className="mt-4">
                Violation of these rules will result in immediate account termination without refund.
              </p>
            </Section>

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-xl font-bold mb-4">Questions?</h3>
              <p className="text-muted-foreground">
                For legal inquiries, please contact <a href="mailto:legal@vystra.ai">legal@vystra.ai</a>.
              </p>
            </div>

          </article>
        </div>
      </div>
    </div>
  );
}

// Reuse the same helper component
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