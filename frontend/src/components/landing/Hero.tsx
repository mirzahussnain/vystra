"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { UploadCloud, FileVideo, Lock, ArrowRight } from "lucide-react"; // Added ArrowRight
import Link from "next/link";
import { useState } from "react";

export function Hero() {
  const [isHovering, setIsHovering] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  // ✅ SEO LOGIC: Determine destination immediately
  // Default to sign-up (for Google Bot/Guests)
  // If loaded and signed in, switch to dashboard
  const destinationLink = (isLoaded && isSignedIn) 
    ? "/dashboard/upload" 
    : "/sign-up?intent=upload";

  return (
    <section
      className="relative flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden px-4 text-center bg-background"
      id="home"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Headline Group */}
      <div className="relative z-10 max-w-4xl mx-auto mb-12">
         {/* ... (Your existing headline code is fine) ... */}
         <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          Search your videos <br />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            like text documents.
          </span>
        </motion.h1>
      </div>

      {/* THE UPLOAD INTERFACE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative w-full max-w-2xl mx-auto z-20"
      >
        {/* ✅ SEO CHANGE: Wrapped in Link instead of div onClick */}
        <Link
          href={destinationLink}
          className="group relative block w-full text-center rounded-2xl border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm p-12 hover:border-primary transition-all cursor-pointer shadow-2xl overflow-hidden outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-label="Upload a video to start searching"
        >
          {/* The "Gated" Overlay Effect */}
          <div
            className={`absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center transition-opacity duration-300 z-10 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          >
             {/* Visual reinforcement inside the overlay */}
            <div className="bg-card/70 border p-6 rounded-xl shadow-xl flex flex-col items-center">
                <Lock className="w-8 h-8 text-primary mb-3" />
                <p className="font-semibold text-lg mb-2">
                    {isSignedIn ? "Go to Dashboard" : "Sign in to upload"}
                </p>
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                    {isSignedIn ? "Upload Now" : "Get Started Free"} <ArrowRight className="w-4 h-4" />
                </div>
            </div>
          </div>

          {/* The "Normal" Look (Indexable Content) */}
          <div className="flex flex-col items-center gap-6">
            <div className="p-5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <div>
            
              <h3 className="text-2xl font-bold">Upload Video</h3>
              <p className="text-muted-foreground mt-2">
                Drag & drop or click to upload
              </p>
            </div>
            
            {/* Keywords for SEO: "MP4", "MOV", "AVI" */}
            <div className="flex gap-4 text-xs text-muted-foreground uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <FileVideo className="w-3 h-3" /> .MP4
              </span>
              <span className="flex items-center gap-1">
                <FileVideo className="w-3 h-3" /> .MOV
              </span>
              <span className="flex items-center gap-1">
                <FileVideo className="w-3 h-3" /> .AVI
              </span>
            </div>
          </div>
        </Link>

        {/* Helper Text */}
        <p className="mt-6 text-sm text-muted-foreground">
          No video?{" "}
          <Link
            href="/demo" // Ideally a real route
            className="text-primary hover:underline underline-offset-4"
          >
            Try a demo file
          </Link>{" "}
          to see how it works.
        </p>
      </motion.div>
    </section>
  );
}