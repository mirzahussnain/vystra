"use client";

import { motion } from "framer-motion";
import { Search, Zap, FileText, Sparkles } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need to <span className="text-primary">Master Your Media</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Vystra transforms passive video files into active, searchable knowledge bases.
          </p>
        </div>

        {/* The Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-[300px]">
          
          {/* Card 1: Large Feature (Span 2 cols) */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 rounded-3xl border border-border bg-card p-8 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="z-10 relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Semantic Video Search</h3>
              <p className="text-muted-foreground">
               {` Don't just match keywords. Find the exact moment a concept was discussed. 
                 "Show me where they talk about Q4 Revenue" takes you straight to 04:15.`}
              </p>
            </div>
            {/* Decorative Gradient/Image */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Card 2: Vertical Feature (Row span 2 if needed, here kept standard) */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Powered by Celery & Redis. Uploads are processed asynchronously in the background.
              </p>
            </div>
            <div className="mt-4 h-20 w-full bg-muted/30 rounded-lg flex items-center justify-center">
              <span className="text-xs font-mono text-primary animate-pulse">Processing: 99%</span>
            </div>
          </motion.div>

          {/* Card 3: Small Feature */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-center"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Full Transcripts</h3>
            <p className="text-muted-foreground text-sm">
              Export speaker-diarized text for meetings, podcasts, and lectures instantly.
            </p>
          </motion.div>

          {/* Card 4: Large Feature (Span 2 cols) */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 rounded-3xl border border-border bg-card p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="z-10 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">AI Summarization</h3>
              <p className="text-muted-foreground">
                Get a bullet-point summary of a 3-hour video in 10 seconds. 
                Understand the content without watching the whole thing.
              </p>
            </div>
             {/* Decorative Elements */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}