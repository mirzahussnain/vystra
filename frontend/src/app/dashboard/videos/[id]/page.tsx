"use client";

import { useState, useRef } from "react";
import {
  CheckCircle2,
  ArrowLeft,
  Download,
  Loader2,
  Share2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Components
import { TranscriptView } from "@/components/dashboard/transcript-view";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { useGetVideoByIdQuery, useGetVideoUrlQuery } from "@/store/api/videoApi";
import { toast } from "sonner";

export default function VideoAnalysisPage() {
  const { id } = useParams();
  const router = useRouter();

  // --- DATA FETCHING ---
  const {
    data: metaData,
    isLoading: isMetaLoading,
    error: metaError,
  } = useGetVideoByIdQuery(id as string);

  const {
    data: streamData,
    isLoading: isUrlLoading,
    error: urlError,
  } = useGetVideoUrlQuery(id as string);

  // --- STATE ---
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- EXPORT LOGIC ---
  const downloadFile = (content: string, type: "json" | "txt") => {
    const mimeType = type === "json" ? "application/json" : "text/plain";
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metaData?.title || "export"}-${new Date().toISOString().slice(0, 10)}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportJSON = (segments: any[]) => {
    if (!segments?.length) {
      toast.error("No segments to export");
      return;
    };
    const content = JSON.stringify(segments, null, 2);
    downloadFile(content, "json");
  };

  const handleExportText = (segments: any[]) => {
    if (!segments?.length) {
      toast.error("No segments to export");
      return;
    };
    const content = segments
      .map(
        (seg) =>
          `[${new Date(seg.start * 1000).toISOString().substr(14, 5)}] ${seg.text}`
      )
      .join("\n");
    downloadFile(content, "txt");
  };

  // --- VIDEO CONTROLS ---
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  // --- LOADING / ERROR STATES ---
  if (isMetaLoading || isUrlLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!metaData || !streamData?.url) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-lg font-medium text-gray-900 my-2">
          Video not found or processing.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between mb-6 flex-col md:flex-row shrink-0">
        <div className="flex md:items-center gap-4 min-w-0 w-full md:w-auto md:flex-row flex-col">
          <Link href="/dashboard/library" className="hidden md:block shrink-0">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <div className="min-h-0 flex-1 overflow-hidden">
            <h1 className="text-md md:text-lg font-bold tracking-tight flex items-center gap-1">
              <span className=" truncate w-fit md:w-[400px] ">
                {metaData.ai_title || metaData.title}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`${metaData.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200 font-bold' : metaData.status === 'processing' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold' : 'bg-red-100 text-red-700 hover:bg-red-200 font-bold'}`}>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                 {metaData.status === 'completed' ? 'Ready' : metaData.status === 'processing' ? 'Processing...' : 'Failed'}
                </Badge>
              </div>
            </h1>
          </div>
        </div>

        <div className="flex gap-4 md:gap-2 shrink-0 mt-4 md:mt-0">
          <Button variant="default" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>

          <div className="flex items-center rounded-md border bg-background shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-r-none px-2 text-xs font-medium hover:bg-muted"
              title="Download JSON (Default)"
              onClick={() => handleExportJSON(metaData?.segments)}
            >
              <Download className="mr-1.5 h-3 w-3 text-muted-foreground" />
              Export
            </Button>
            <div className="h-4 w-[1px] bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-6 rounded-l-none px-0 hover:bg-muted"
                >
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => handleExportJSON(metaData?.segments)}
                  className="text-xs cursor-pointer"
                >
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExportText(metaData?.segments)}
                  className="text-xs cursor-pointer"
                >
                  Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid  md:grid-cols-3 gap-6 h-full min-h-0">
        
        {/* LEFT COLUMN: Video + AI Insights (Scrollable Container) */}
        {/* Note: This single div spans 2 columns and contains BOTH items */}
        <div className="md:col-span-2 flex flex-col gap-6  pr-2 pb-10">
          
          {/* Item A: Video Player */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-border/50 sticky flex items-center justify-center aspect-video w-full shrink-0">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              onTimeUpdate={handleTimeUpdate}
              src={streamData.url}
            />
          </div>

          {/* Item B: AI Insights */}
          <div className="w-full">
             {(metaData?.status === 'processing' || metaData?.status === 'failed' || !metaData?.ai_title) ? (
                <div className="flex flex-col h-64 border border-border rounded-xl bg-card overflow-hidden shadow-sm">
                  <h2 className="font-bold text-center p-4 bg-muted/30 border-b">AI Insights</h2>
                  <div className="flex flex-col py-3 items-center justify-center h-full gap-2 text-muted-foreground">
                   
                     <span>{metaData?.status === 'processing' ? 'Processing ...' : 'Not Available'}</span>
                  </div>
                </div>
             ) : (
                <AIInsights 
                    // Ensure these prop names match your AIInsights component exactly
                    summary={metaData.summary} 
                    ai_title={metaData.ai_title} 
                    key_takeaways={metaData.key_takeaways} // Fixed typo from 'key_takeways'
                  action_items={metaData.action_items} 
                  transcriptData={ { segments: metaData.segments, currentTime:currentTime, onSeek:handleSeek }  }
                />
             )}
          </div>
        </div>

         {/*RIGHT COLUMN: Transcript (Fixed Height) */}
        <div className="h-full min-h-0 hidden md:block">
          <TranscriptView
            currentTime={currentTime}
            onSeek={handleSeek}
            segments={metaData.segments || []} // Use analysis field for transcript segments
            video_Id={metaData.video_id}
          />
        </div>

      </div>
    </div>
  );
}