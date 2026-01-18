import { Loader2, Search } from "lucide-react"
import { Dispatch, SetStateAction, useDeferredValue, useEffect, useMemo, useState } from "react"
import { Input } from "../ui/input"
import { useLazySemanticSearchVideosQuery } from "@/store/api/videoApi"
import { toast } from "sonner";

interface SmartSearchProps{
  video_Id?: string,
  segments: { start: number; end: number; text: string }[];
  isPro: boolean;
  filterTranscript: Dispatch<SetStateAction<{
    start: number;
    end: number;
    text: string;
  }[]>>;
  onSearchChange?: (query: string) => void;
}
export const SmartSearch = ({video_Id,isPro=false, segments, filterTranscript, onSearchChange}: SmartSearchProps) => {
  const [searchText, setSearchText] = useState('')
  const deferredSearch = useDeferredValue(searchText)
  const [triggerAiSearch, { data: aiResults, isFetching: loading }] = useLazySemanticSearchVideosQuery();
  
 
  
  const searchAbleSegments = useMemo(() => {
   
    return segments.map((seg) => ({
      ...seg,
     
      searchBlob: seg?.text.toLowerCase()
    }));
  }, [segments]);
  
  const keywordResults=useMemo(() => {
    if (!deferredSearch || isPro) return []
    return searchAbleSegments.filter((segment)=>segment.searchBlob.includes(deferredSearch.toLowerCase())).slice(0, 10)
  }, [deferredSearch, searchAbleSegments, isPro])
  
 
  
  
  const handleAiSearch = async () => {
    if (!searchText.trim() || !isPro) return;
        try {
          await triggerAiSearch({
            search: searchText,
            video_id: video_Id
          }).unwrap();
        } catch (error) {
          toast.error("Search failed", {description: error?.data?.detail || "Something went wrong. Please try again."});
        }
    };
  
  useEffect(() => {
      onSearchChange?.(deferredSearch);
    }, [deferredSearch, onSearchChange]);
  
  // Effect A: Handles Resetting & Free Search (Runs on Typing)
    useEffect(() => {
      // 1. Reset if empty
      if (!deferredSearch) {
        filterTranscript(segments);
        return;
      }
  
      // 2. If Pro, DO NOTHING while typing. 
      // We wait for the 'aiResults' effect to fire later.
      if (isPro) return;
  
      // 3. If Free, update live
      filterTranscript(keywordResults);
    }, [deferredSearch, isPro, keywordResults, segments, filterTranscript]);
  
    // Effect B: Handles Pro Search (Runs ONLY when API data changes)
    useEffect(() => {
      if (isPro && aiResults) { 
            filterTranscript(aiResults);
          }
      }, [aiResults, isPro, filterTranscript]);

  return (
    <div className="md:relative max-sm:absolute max-sm:-translate-y-8 max-sm:-translate-x-4 max-sm:z-20   ">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search transcript..."
        className="pl-12  bg-background max-sm:bg-slate-200"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => isPro && e.key === "Enter" && handleAiSearch()}
        disabled={loading}
      />
      {/* Visual Feedback for Loading */}
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
    </div>
  )
  
}