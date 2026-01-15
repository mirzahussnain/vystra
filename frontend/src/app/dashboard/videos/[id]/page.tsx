"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { TranscriptView } from "@/components/dashboard/transcript-view";
import { ArrowLeft, Download, Loader2, Share2,AlertCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { useGetVideoByIdQuery, useGetVideoUrlQuery } from "@/store/api/videoApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function VideoAnalysisPage() {
  const { id } = useParams();
  const router = useRouter();
  const {data:metaData,isLoading:isMetaLoading,error:metaError}=useGetVideoByIdQuery(id as string);
  const { data: streamData, isLoading: isUrlLoading, error: urlError } = useGetVideoUrlQuery(id as string);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  
  
  const downloadFile = (content: string, type: 'json' | 'txt') => {
      const mimeType = type === 'json' ? 'application/json' : 'text/plain';
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${metaData?.title}-${new Date().toISOString().slice(0,10)}.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
 
  const handleExportJSON = (segments: { start: number, end: number, text: string }[]) => {
      if (!segments?.length) return;
      // Pretty print JSON with indentation
      const content = JSON.stringify(segments, null, 2);
      downloadFile(content, 'json');
    };
 
  const handleExportText = (segments: { start: number, end: number, text: string }[]) => {
      if (!segments?.length) return;
      // Format: start: 0, end: 5, text: "..."
      const content = segments.map(seg => 
        `Start Time: ${seg.start}, End Time: ${seg.end}, Text: "${seg.text}"`
      ).join('\n');
      downloadFile(content, 'txt');
    }; 
  
  
  

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
  
  if (isMetaLoading || isUrlLoading) {
      return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }
  
  if (!metaData || !streamData?.url) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-lg font-medium text-gray-900 my-2">Video not found or processing.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      );
    }
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      
      {/* Top Bar: Back Button & Title */}
      <div className="flex items-center justify-between mb-6 flex-col md:flex-row">
        <div className="flex md:items-center gap-4 min-w-0 w-full md:w-auto md:flex-row flex-col">
            <Link href="/dashboard/library" className="shrink-0">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
            </Link>
            <div className="min-h-0 flex-1 overflow-hidden">
                <h1 className="text-md md:text-lg font-bold tracking-tight flex items-center gap-2">
                    <span className="truncate max-w-[200px] md:max-w-lg flex-1">{metaData.title}</span>
              <Badge variant="outline" className="text-muted-foreground font-normal flex-2">{metaData.status}</Badge>
                </h1>
            </div>
        </div>
        <div className="flex gap-4 md:gap-2 shrink-0 mt-4 md:mt-0">
            <Button variant="default" size="sm" >
                <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            {/*<Button variant="default" size="sm" onClick={()=>handleExport(metaData.analysis)}>
                <Download className="w-4 h-4 mr-2" /> Export Text
            </Button>*/}
            <div className="flex items-center rounded-md border bg-background shadow-sm">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 rounded-r-none px-2 text-xs font-medium hover:bg-muted" 
                                    title="Download JSON (Default)"
                                    onClick={() => handleExportJSON(metaData?.analysis)}
                                >
                                    <Download className="mr-1.5 h-3 w-3 text-muted-foreground" />
                                    Export
                                </Button>
                                <div className="h-4 w-[1px] bg-border" /> {/* Divider */}
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
                                        <DropdownMenuItem onClick={() => handleExportJSON(metaData?.analysis)} className="text-xs cursor-pointer">
                                            JSON
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExportText(metaData?.analysis)} className="text-xs cursor-pointer">
                                            Text
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid lg:grid-cols-3 gap-6 h-full min-h-0">
        
        {/* LEFT: Video Player (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-lg border border-border/50 relative flex items-center justify-center aspect-video h-fit">
             <video
                ref={videoRef}
                className="w-full h-full  object-contain"
                controls
                onTimeUpdate={handleTimeUpdate}
                // Use a real sample video URL for testing
                src={streamData.url}
             />
        </div>

        {/* RIGHT: Interactive Transcript (Takes 1 column) */}
        <div className="h-full min-h-0">
            <TranscriptView 
                currentTime={currentTime} 
            onSeek={handleSeek} 
            segments={metaData.analysis as { start: number; end: number; text: string }[]}
            />
        </div>

      </div>
    </div>
  );
}