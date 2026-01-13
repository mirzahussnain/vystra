"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "../ui/particles";

// Mock Data: This mimics what your backend WOULD return
const DEMO_TRANSCRIPT = [
  { time: 5, text: "Welcome to InsightStream, the AI video search engine." },
  { time: 12, text: "You can upload any MP4 file to our secure cloud storage." },
  { time: 18, text: "Our AI instantly transcribes the audio with near-perfect accuracy." },
  { time: 24, text: "Then, you can search for any spoken phrase." },
  { time: 30, text: "It's like Command-F for your video library." },
];

const DemoSection = () => {
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simple "Search" Logic for the demo
  const results = query 
    ? DEMO_TRANSCRIPT.filter(t => t.text.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleJump = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative py-32 bg-background border-t border-border overflow-hidden">
            
          {/* 1. PARTICLE BACKGROUND */}
          <Particles className="z-0" />
    
          {/* 2. Gradient Glow (Optional depth) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />
    
          <div className="container relative z-10 mx-auto px-6">
            
            <div className="text-center mb-16">
                {/* 3. UPDATED TYPOGRAPHY to match Bento Grid */}
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                    See it in <span className="text-primary">action</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Try searching the transcript below. Type <span className="text-primary font-mono font-bold">{"AI"}</span> or <span className="text-primary font-mono font-bold">{"cloud"}</span>.
                </p>
            </div>
    
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto bg-card/50 backdrop-blur-sm p-2 rounded-3xl border border-border/50 shadow-2xl">
                
                {/* LEFT: Video Player */}
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group shadow-inner">
                    <video 
                        ref={videoRef}
                        className="w-full h-full object-cover opacity-80"
                        loop
                        poster="https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=2664&auto=format&fit=crop" 
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all group-hover:bg-primary/80 group-hover:border-primary"
                            onClick={togglePlay}
                        >
                            {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                        </Button>
                    </div>
                </div>
    
                {/* RIGHT: Search Interface */}
                <div className="flex flex-col h-full min-h-[400px] p-4 lg:p-6">
                    
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search transcript..." 
                            className="pl-12 h-12 text-lg bg-background/50 border-border focus-visible:ring-primary shadow-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
    
                    <div className="flex-1 rounded-xl border border-border bg-background/30 p-2 overflow-y-auto max-h-[350px] space-y-2 pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {query === "" ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4 min-h-[200px]">
                                    <Search className="w-12 h-12 opacity-20" />
                                    <p className="text-sm">Type keywords to jump to timestamps...</p>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                   {` No matches found for ${query}`}
                                </div>
                            ) : (
                                results.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-4 rounded-lg bg-card hover:bg-primary/5 border border-transparent hover:border-primary/20 cursor-pointer transition-all shadow-sm"
                                        onClick={() => handleJump(item.time)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                                00:{item.time.toString().padStart(2, '0')}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                Click to Play
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/90">
                                            {item.text.split(" ").map((word, w_i) => (
                                                word.toLowerCase().includes(query.toLowerCase()) ? (
                                                    <span key={w_i} className="bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 font-bold px-0.5 rounded">
                                                        {word}{" "}
                                                    </span>
                                                ) : (
                                                    <span key={w_i}>{word} </span>
                                                )
                                            ))}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
    
            </div>
          </div>
        </section>
  );
}

export default DemoSection;