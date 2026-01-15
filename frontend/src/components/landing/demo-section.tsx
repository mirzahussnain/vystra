"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, Pause, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "../ui/particles";
import {
  useGetVideoByIdQuery,
  useGetVideoUrlQuery,
} from "@/store/api/videoApi";
import React from "react";
import { DEMO_TRANSCRIPT } from "@/constants/demo";
import { cn } from "@/lib/utils";

interface AnalysisSegment {
  start: number;
  end: number;
  text: string;
}

const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || "";
// --- 1. OPTIMIZATION: Extract Item to prevent unnecessary re-renders ---

const TranscriptItem = React.memo(
  ({ item, query, isActive, onJump, shouldScroll }: any) => {
    const parts = useMemo(() => {
      if (!query) return [item.text];
      try {
        return item.text.split(new RegExp(`(${query})`, "gi"));
      } catch (e) {
        return [item.text];
      }
    }, [item.text, query]);

    const itemRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (isActive && itemRef.current && shouldScroll) {
        itemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, [isActive, shouldScroll]);
    return (
      <motion.div
        layout
        ref={itemRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onJump(item.start, item.end)}
        className={cn(
          "p-4 rounded-lg border cursor-pointer transition-all duration-300 group relative overflow-hidden",
          isActive
            ? "bg-primary/10 border-primary shadow-md"
            : "bg-card hover:bg-muted border-transparent hover:border-primary/20",
        )}
      >
        <div className="flex justify-between items-center mb-2">
          <span
            className={cn(
              "text-xs font-mono font-bold px-2 py-1 rounded transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {new Date(item.start * 1000).toISOString().substr(14, 5)}
          </span>
        </div>
        <p
          className={cn(
            "text-sm leading-relaxed transition-colors",
            isActive ? "text-foreground font-medium" : "text-muted-foreground",
          )}
        >
          {parts.map((part: string, i: number) =>
            part.toLowerCase() === query.toLowerCase() && query !== "" ? (
              <span
                key={i}
                className="bg-yellow-400/30 text-yellow-600 dark:text-yellow-400 font-bold px-0.5 rounded"
              >
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>
      </motion.div>
    );
  },
);

TranscriptItem.displayName = "TranscriptItem";

const DemoSection = () => {
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  if (!DEMO_VIDEO_URL) {
    console.error("Missing NEXT_PUBLIC_DEMO_VIDEO_URL in .env file");
  }

  const results = useMemo(() => {
    if (!query) return DEMO_TRANSCRIPT;
    return DEMO_TRANSCRIPT.filter((t) =>
      t.text.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  // const handleTimeUpdate = useCallback(() => {
  //     if (videoRef.current) {
  //       setCurrentTime(videoRef.current.currentTime);
  //     }
  //   }, []);
  const handleJump = useCallback((start: number, end: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = start;
      videoRef.current.play();
      setIsPlaying(true);
      setEndTime(end);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      // Check if we hit the target end time
      if (endTime !== null && current >= endTime) {
        videoRef.current.pause();
        setIsPlaying(false);
        setEndTime(null); // Reset target so normal play works later
      }
    }
  }, [endTime]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setEndTime(null); // Clear auto-pause if user manually pauses
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  return (
    <section className="relative py-32 bg-background border-t border-border overflow-hidden">
      {/* 1. PARTICLE BACKGROUND */}
      <Particles className="z-0 absolute inset-0" />

      {/* 2. Gradient Glow (Optional depth) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            See it in <span className="text-primary">action</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try searching the transcript below. Type{" "}
            <span className="text-primary font-mono font-bold">{"AI"}</span> or{" "}
            <span className="text-primary font-mono font-bold">{"cloud"}</span>.
          </p>
        </div>

        {/* ERROR STATE if Env Var is missing */}
        {!DEMO_VIDEO_URL ? (
          <div className="flex flex-col items-center justify-center p-12 border border-red-200 bg-red-50 rounded-xl text-red-600">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p className="font-bold">Demo Video URL Missing</p>
            <p className="text-sm">
              Please add NEXT_PUBLIC_DEMO_VIDEO_URL to your .env file.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto bg-card/50 backdrop-blur-sm p-2 rounded-3xl border border-border/50 shadow-2xl">
            {/* LEFT: Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group shadow-inner">
              <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-90"
                playsInline
                loop
                preload="metadata"
                src={DEMO_VIDEO_URL}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all pointer-events-auto hover:scale-110 hover:bg-primary/80 hover:border-primary",
                    isPlaying
                      ? "opacity-0 group-hover:opacity-100"
                      : "opacity-100",
                  )}
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </Button>
              </div>
            </div>

            {/* RIGHT: Search & Transcript */}
            <div className="flex flex-col h-full min-h-[500px] p-4 lg:p-6">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search transcript..."
                    className={cn(
                      "pl-12 h-12 text-lg bg-background/50 border-border focus-visible:ring-primary shadow-sm",
                    )}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 rounded-xl border border-border bg-background/30 p-2 overflow-y-auto max-h-[350px] space-y-2 pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {results.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No matches found.
                    </div>
                  ) : (
                    results.map((item, i) => {
                      const isActive =
                        currentTime >= item.start && currentTime < item.end;
                      return (
                        <TranscriptItem
                          key={i}
                          item={item}
                          query={query}
                          isActive={isActive}
                          shouldScroll={currentTime > 0}
                          // FIX: Pass the function directly. It is stable because of useCallback.
                          onJump={handleJump}
                        />
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DemoSection;
