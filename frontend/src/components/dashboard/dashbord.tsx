"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadZone  from "./upload-zone";
import { Search, Upload } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
      <Tabs defaultValue="upload" className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Console</h2>
          <TabsList>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upload" className="mt-0">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium">Add to your Library</h3>
            <p className="text-sm text-muted-foreground">
              Upload video files to be indexed by our AI.
            </p>
          </div>
          <UploadZone />
        </TabsContent>

        <TabsContent value="search" className="min-h-[300px] flex items-center justify-center text-muted-foreground">
          Search Interface Coming Soon...
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;