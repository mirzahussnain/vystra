"use client";

import { VideoList } from "@/components/dashboard/video-list";
import ErrorDisplayer from "@/components/global/error-displayer";
import Loader from "@/components/global/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatDuration } from "@/lib/utils";
import {
  useGetDashboardStatsQuery,
  useGetVideosQuery,
} from "@/store/api/videoApi";
import { useUser } from "@clerk/nextjs";
import { Activity, Clock, FileVideo, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";


const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {  isLoaded: userLoaded } = useUser();
  const [pollingInterval, setPollingInterval] = useState(0);
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: stats_error,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: pollingInterval,
  });
  const {
    data: videos,
    isLoading: videosLoading,
    isError: videoError,
    error: video_error,
  } = useGetVideosQuery(
    searchTerm,
    {
      pollingInterval: pollingInterval,
    },
  );


  useEffect(() => {
    if (videos) {
      const hasActiveJobs = videos.some(
        (video: any) =>
          video.status === "processing" || video.status === "uploading",
      );

      // If active jobs exist, set interval to 3000ms, otherwise 0ms
      setPollingInterval(hasActiveJobs ? 3000 : 0);
    }
  }, [videos]);

  if (!userLoaded || videosLoading || statsLoading) {
    return (
      <Loader
        text={ "Loading Dashboard"
        }
      />
    );
  }

  const errorMessage =
    (video_error as any)?.data?.details ||
    (stats_error as any)?.data?.details ||
   
    "An unexpected error occurred";

  if (videoError || statsError) {
    return (
      <ErrorDisplayer error={`Failed to load dashboard: ${errorMessage}`} />
    );
  }

  // // "Hours Saved" Logic: Assuming summarizing takes 2x the video length manually
  // const hoursSaved = (((stats?.total_minutes || 0) * 2) / 60).toFixed(1);

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
          value={`${stats?.total_videos || 0}`}
          icon={FileVideo}
          desc={`+${stats?.recent_videos || 0} from last week`}
        />
        <StatsCard
          title="Minutes Processed"
          value={`${stats?.minutes_used || 0}`}
          icon={Clock}
          desc={`${Math.round(stats?.minutes_percent || 0)}% of ${formatDuration(stats?.minutes_limit || 0)} limit`}
        />
        <StatsCard
          title="Storage Used"
          value={`${formatBytes(stats.storage_used || 0)}`}
          icon={HardDrive}
          desc={`${stats.storage_percent}% of ${formatBytes(stats.storage_limit)} limit`}
        />
        <StatsCard
          title="AI Actions"
          value={`${stats?.ai_score} / ${stats?.ai_limit}`}
          icon={Activity}
          desc={`Monthly Quota`}
        />
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-3">Recent Uploads</h3>
          <VideoList
            videos={videos}
            isError={videoError}
            isLoading={videosLoading}
          />
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
