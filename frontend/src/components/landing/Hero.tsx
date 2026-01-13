"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UploadCloud, FileVideo, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function Hero() {
  const [isHovering, setIsHovering] = useState(false);

  const handleFakeUpload = () => {
    toast("Sign in required", {
        description: "Please create a free account to process your videos.",
        action: {
            label: "Sign In",
            onClick: () => window.location.href = "/dashboard" // In real app, /login
        }
    });
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden px-4 text-center bg-background">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Headline Group */}
      <div className="relative z-10 max-w-4xl mx-auto mb-12">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-sm text-secondary-foreground mb-6"
        >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>v1.0 is now live</span>
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          Search your videos <br />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            like text documents.
          </span>
        </motion.h1>

        <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {" Stop scrubbing through timelines. Just type what you're looking for."}
        </motion.p>
      </div>

      {/* THE HONEYPOT INTERFACE (Remove.bg Style) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative w-full max-w-2xl mx-auto z-20"
      >
        <div 
            className="group relative rounded-2xl border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm p-12 hover:border-primary transition-all cursor-pointer shadow-2xl overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleFakeUpload}
        >
            {/* The "Gated" Overlay Effect */}
            <div className={`absolute inset-0 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}>
                <Lock className="w-10 h-10 text-primary mb-2" />
                <p className="font-semibold text-lg">Sign in to upload</p>
                <Button className="mt-4">Get Started for Free</Button>
            </div>

            {/* The "Normal" Look */}
            <div className="flex flex-col items-center gap-6">
                <div className="p-5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UploadCloud className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Upload Video</h3>
                    <p className="text-muted-foreground mt-2">Drag & drop or click to upload</p>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1"><FileVideo className="w-3 h-3"/> .MP4</span>
                    <span className="flex items-center gap-1"><FileVideo className="w-3 h-3"/> .MOV</span>
                    <span className="flex items-center gap-1"><FileVideo className="w-3 h-3"/> .AVI</span>
                </div>
            </div>
        </div>
        
        {/* Helper Text */}
        <p className="mt-6 text-sm text-muted-foreground">
            No video? <Link href="#" className="text-primary hover:underline underline-offset-4">Try a demo file</Link> to see how it works.
        </p>

      </motion.div>

    </section>
  );
}