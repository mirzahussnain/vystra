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

const LibraryPage = () => {
  return (
    <div className="h-full flex flex-col space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        
        {/* Title & Subtitle */}
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Library</h1>
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
                  placeholder="Search videos..."
                  className="pl-12 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary"
                />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 w-full sm:w-auto border-dashed">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Ready</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Processing</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Failed</DropdownMenuCheckboxItem>
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
          <VideoList />
      </div>

    </div>
  );
}

export default LibraryPage;