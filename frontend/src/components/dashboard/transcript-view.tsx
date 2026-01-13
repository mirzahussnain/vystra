"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Transcript Data (We will fetch this from backend later)
const MOCK_TRANSCRIPT = [
  { start: 0, end: 5, text: "Welcome to this quarterly review meeting." },
  { start: 5, end: 12, text: "Today we are going to discuss the Q4 revenue figures which, frankly, look amazing." },
  { start: 12, end: 18, text: "But before we dive into the numbers, let's talk about the new marketing initiative." },
  { start: 18, end: 25, text: "We launched the campaign on Monday and the engagement has been double what we expected." },
  { start: 25, end: 30, text: "John, can you pull up the graph for the user acquisition costs?" },
  { start: 30, end: 38, text: "As you can see here, the cost per lead has dropped by 15%." },
  { start: 38, end: 45, text: "This is primarily due to the new video ads we are running on social media." },
];

interface TranscriptViewProps {
  currentTime: number;
  onSeek: (time: number) => void;
}

export function TranscriptView({ currentTime, onSeek }: TranscriptViewProps) {
  const [search, setSearch] = useState("");

  // Filter transcript based on search
  const filteredTranscript = MOCK_TRANSCRIPT.filter((segment) =>
    segment.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      
      {/* Header: Search Bar */}
      <div className="p-4 border-b border-border bg-muted/20">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
            Transcript 
            <span className="text-xs font-normal text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                {filteredTranscript.length} segments
            </span>
        </h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            className="pl-12 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Body: Scrollable Text */}
      <ScrollArea className="flex-1 p-4 h-[500px]">
        <div className="space-y-4">
          {filteredTranscript.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">No matches found.</p>
          ) : (
            filteredTranscript.map((segment, index) => {
              // Check if this segment is currently active
              const isActive = currentTime >= segment.start && currentTime < segment.end;

              return (
                <div
                  key={index}
                  onClick={() => onSeek(segment.start)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted",
                    isActive 
                        ? "bg-primary/10 border-l-4 border-primary shadow-sm" 
                        : "border-l-4 border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-xs font-mono font-medium", isActive ? "text-primary" : "text-muted-foreground/70")}>
                        {new Date(segment.start * 1000).toISOString().substr(14, 5)}
                    </span>
                  </div>
                  <p className={cn("text-sm leading-relaxed", isActive ? "font-medium text-foreground" : "")}>
                    {/* Highlight search terms */}
                    {search ? (
                        segment.text.split(new RegExp(`(${search})`, 'gi')).map((part, i) => 
                            part.toLowerCase() === search.toLowerCase() ? <span key={i} className="bg-yellow-500/30 text-yellow-700 dark:text-yellow-400 font-bold px-0.5 rounded">{part}</span> : part
                        )
                    ) : (
                        segment.text
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}