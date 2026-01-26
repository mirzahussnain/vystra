"use client";

import { VideoList } from "@/components/dashboard/video-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeferredValue, useMemo, useState } from "react";
import { useGetVideosQuery } from "@/store/api/videoApi";


type FilterStatus = "All" | "completed" | "pending" | "processing" | "failed";
const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const deferredQuery = useDeferredValue(searchTerm);
  const {
    data: videos = [],
    isLoading,
    isError,
  } = useGetVideosQuery(undefined, { pollingInterval: 3000 });

  const searchableVideos = useMemo(() => {
    return videos.map((video) => ({
      ...video,
     
      searchBlob: `${video.title} ${video.segments?.map((s:any) => s.text).join(" ")}`.toLowerCase()
    }));
  }, [videos]);
  
  
  const filteredVideos = useMemo(() => {
      const term = deferredQuery.toLowerCase();
    
  
      return searchableVideos.filter((video) => {
          const matchesSearch = video.searchBlob.includes(term); // Super fast string check
          const matchesStatus = statusFilter === "All" || video.status === statusFilter;
          return matchesSearch && matchesStatus;
        });
  }, [searchableVideos, deferredQuery, statusFilter]);

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading your videos...
      </div>
    );
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        Error connecting to backend. Is Docker running?
      </div>
    );
  return (
    <div className="h-full flex flex-col space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Library
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your video assets and transcriptions.
          </p>
        </div>

        {/* Action Bar: Search, Filter, Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos By Title or Transcript..."
              className="pl-12 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-2 w-full sm:w-auto border-dashed"
              >
                <Filter className="h-4 w-4" />
                {statusFilter === "All"
                  ? "Filter"
                  : `Status: ${statusFilter.replace(statusFilter.charAt(0), statusFilter.charAt(0).toUpperCase())}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "All"}
                onCheckedChange={() => setStatusFilter("All")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "completed"}
                onCheckedChange={() => setStatusFilter("completed")}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "pending"}
                onCheckedChange={() => setStatusFilter("pending")}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "processing"}
                onCheckedChange={() => setStatusFilter("processing")}
              >
                Processing
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "failed"}
                onCheckedChange={() => setStatusFilter("failed")}
              >
                Failed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Primary Action */}
          <Link href="/dashboard/upload" className="w-full sm:w-auto">
            <Button className="h-10 gap-2 w-full shadow-md">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Upload</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* CONTENT SECTION */}
      {/* We wrap the list in a flex-1 container to handle height properly */}
      <div className="flex-1 min-h-0">
        {/* Empty State Feedback */}
        {!isLoading && filteredVideos.length === 0 && videos.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-2">
            <Filter className="h-8 w-8 opacity-20" />
            <p>No videos found matching these filters.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <VideoList
            videos={filteredVideos}
            isLoading={isLoading}
            isError={isError}
          />
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
