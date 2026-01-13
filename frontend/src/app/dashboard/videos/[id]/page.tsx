"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TranscriptView } from "@/components/dashboard/transcript-view";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function VideoAnalysisPage({ params }: { params: { id: string } }) {
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update state when video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Jump video when transcript is clicked
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      
      {/* Top Bar: Back Button & Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Link href="/dashboard/library">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
            </Link>
            <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Quarterly_Review_Q4.mp4
                    <Badge variant="outline" className="text-muted-foreground font-normal">Processed</Badge>
                </h1>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export Text
            </Button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid lg:grid-cols-3 gap-6 h-full min-h-0">
        
        {/* LEFT: Video Player (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-lg border border-border/50 relative flex items-center justify-center">
             <video
                ref={videoRef}
                className="w-full h-full max-h-[70vh] object-contain"
                controls
                onTimeUpdate={handleTimeUpdate}
                // Use a real sample video URL for testing
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
             />
        </div>

        {/* RIGHT: Interactive Transcript (Takes 1 column) */}
        <div className="h-full min-h-0">
            <TranscriptView 
                currentTime={currentTime} 
                onSeek={handleSeek} 
            />
        </div>

      </div>
    </div>
  );
}