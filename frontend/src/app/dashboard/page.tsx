"use client"

import { VideoList } from "@/components/dashboard/video-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetVideosQuery } from "@/store/api/videoApi";
import { Activity, Clock, FileVideo, HardDrive } from "lucide-react";
import { useState } from "react";

const DashboardPage = () => {
  const [searchTerm,setSearchTerm]=useState('')
  const { data: videos, isLoading, isError } = useGetVideosQuery(searchTerm, { pollingInterval: 3000 })
 
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back to your workspace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Videos"
          value={videos?.length}
          icon={FileVideo}
          desc="+2 from last week"
        />
        <StatsCard
          title="Minutes Processed"
          value="245"
          icon={Clock}
          desc="1.2 hours saved"
        />
        <StatsCard
          title="Storage Used"
          value="1.2 GB"
          icon={HardDrive}
          desc="12% of 10GB limit"
        />
        <StatsCard
          title="API Requests"
          value="450"
          icon={Activity}
          desc="+12% activity"
        />
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-3">Recent Uploads</h3>
          <VideoList videos={videos} isError={isError} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

function StatsCard({ title, value, icon: Icon, desc }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default DashboardPage;
