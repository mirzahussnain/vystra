"use client";

import { ScrollArea } from "@/components/ui/scroll-area";


import { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { TranscriptViewProps } from "@/lib/types";
import { SmartSearch } from "../global/smart-search";
import { Sparkles,Lock } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

/**
 * UTILITY: Escape special characters for Regex.
 * Prevents the app from crashing if a user searches for characters 
 * that have special meaning in Regex (like '?', '*', '(', etc.).
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const TranscriptView = ({
  segments,
  currentTime,
  onSeek,
  video_Id,
  isPro=false,
}: TranscriptViewProps) => {
  const userStats=useSelector((state:RootState)=>state.stats)
  const [search, setSearch] = useState("");
  const [filteredTranscript, setFilteredTranscript] = useState(segments);
  // REF: Tracks if the user is hovering over the list.
  const isUserHovering = useRef(false);
  const router = useRouter();
  

  // EFFECT: Reset the list when the video changes.
  // This ensures that if you switch from Video A to Video B, you don't see Video A's leftover search results.
    useEffect(() => {
      setFilteredTranscript(segments);
    }, [segments]);
 
  // Find the index of the segment currently playing in the video.
  const activeIndex = useMemo(() => {
    if (!filteredTranscript) return -1;
    return filteredTranscript?.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end,
    );
  }, [currentTime, filteredTranscript]);

  // EFFECT: Smart Auto-Scroll
  // Keeps the transcript synced with the video, but with strict guard clauses 
  // to prevent annoying UX (e.g., scrolling while the user is reading).
  useEffect(() => {
    //Only auto-scroll if we found a match AND the user isn't actively searching/hovering
    if (activeIndex !== -1 && !search && !isUserHovering.current) {
      const activeElement = document.getElementById(
        `transcript-segment-${activeIndex}`,
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeIndex, search]);

  
  // Safety check for empty data
  if (!filteredTranscript) {
    return (
      <div className="flex items-center justify-center h-full">
        No segments found
      </div>
    );
  }

  return (
    <div
      className="flex flex-col  md:border md:border-border md:rounded-xl bg-card overflow-hidden md:shadow-sm"
      onMouseEnter={() => (isUserHovering.current = true)}
      onMouseLeave={() => (isUserHovering.current = false)}
    >
      {/* Header: Search Bar */}
      <div className="block p-4 md:border-b md:border-border bg-muted/20 ">
        <h3 className="hidden md:flex font-semibold mb-3  items-center gap-2">
          Transcript ({userStats?.plan === 'pro' || userStats?.plan === 'enterprise' ? 'Pro' : 'Free'})
          <span className="text-xs font-normal truncate bg-primary/10 px-2 py-0.5 rounded-full text-primary">
            {filteredTranscript?.length} segments
          </span>
        </h3>
        
        {/* SMART SEARCH COMPONENT */}
        {/* We pass 'onSearchChange' to lift the search text state up for highlighting */}
        <SmartSearch
          segments={segments}
          filterTranscript={setFilteredTranscript}
          video_Id={video_Id}
          isPro={userStats?.plan === 'pro' || userStats?.plan === 'enterprise'}
          onSearchChange={setSearch}
        />
      </div>

      {/* Body: Scrollable Text */}
      <ScrollArea className="h-full md:h-[300px] w-full pt-2 px-2 max-sm:mt-10">
        <div className="space-y-4 ">
          {filteredTranscript?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                            
                            {/* Scenario A: User is NOT Pro (The Upsell) */}
                            {!isPro && search ? (
                                <div className="space-y-3 max-w-xs">
                                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                         <Sparkles className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-foreground">No exact matches found</h4>
                                    <p className="text-sm text-muted-foreground">
                                        You are searching for <strong>"{search}"</strong>. Standard search only finds exact words.
                                    </p>
                                    
                                    <div className="pt-2">
                    <Button variant="default" size="sm" className="w-full gap-2"
                      onClick={() => router.push('/pricing')}>
                                            <Lock className="w-3 h-3" />
                                            Upgrade to AI Search
                                         </Button>
                                         <p className="text-[10px] text-muted-foreground mt-2">
                                            Pro uses AI to find <em>meanings</em> (e.g. searching "Cost" finds "$500").
                                         </p>
                                    </div>
                                </div>
                            ) : (
                                // Scenario B: User IS Pro (Truly no results) OR Search is empty
                                <p className="text-sm text-muted-foreground">No matches found.</p>
                            )}
            
                        </div>
          ) : (
            filteredTranscript?.map((segment, index) => {
              // Check if this segment is currently active
              const isActive =
                currentTime >= segment.start && currentTime < segment.end;

              return (
                <div
                  key={index}
                  // 3. ADDED: Unique ID for scrolling
                  id={`transcript-segment-${index}`}
                  onClick={() => onSeek(segment.start)}
                  className={cn(
                    "py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted",
                    isActive
                      ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                      : "border-l-4 border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Timestamp Pill */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-xs font-mono font-medium",
                        isActive ? "text-primary" : "text-muted-foreground/70",
                      )}
                    >
                      {new Date(segment.start * 1000)
                        .toISOString()
                        .substr(14, 5)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-sm leading-relaxed",
                      isActive ? "font-medium text-foreground" : "",
                    )}
                  >
                    {/* Highlight search terms */}
                    {search
                      ? segment.text
                          .split(new RegExp(`(${escapeRegExp(search)})`, "gi"))
                          .map((part, i) =>
                            part.toLowerCase() === search.toLowerCase() ? (
                              <span
                                key={i}
                                className="bg-yellow-500/30 text-yellow-700 dark:text-yellow-400 font-bold px-0.5 rounded"
                              >
                                {part}
                              </span>
                            ) : (
                              part
                            ),
                          )
                      // Fallback: Just render text if no search
                      : segment.text}
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
