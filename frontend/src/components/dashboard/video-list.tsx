"use client";

import { useEffect, useState } from "react";
import { api, Video } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  PlayCircle,
  Clock,
  Loader2,
  AlertCircle,
  Trash,
  Copy,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchVideos = async () => {
    try {
      // In a real scenario, this hits your FastAPI backend
      // const res = await api.get("/videos/");
      // setVideos(res.data);

      // FOR NOW: Let's Mock it so you can see the UI immediately
      // Remove this mock block once your backend is fully connected
      setTimeout(() => {
        setVideos([
          {
            id: "1",
            title: "Quarterly_Review_Q4.mp4",
            filename: "vid_001.mp4",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Steve_Jobs_Keynote.mp4",
            filename: "vid_002.mp4",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    // In real app: await api.delete(`/videos/${id}`)
    setVideos(videos.filter((v) => v.id !== id));
    toast.success("Video deleted", {
      description: "The video has been removed from your library.",
    });
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.info("ID Copied", { description: id });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Loading your library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-red-500">
        <AlertCircle className="w-8 h-8 mb-4" />
        <p>Failed to load videos. Is the backend running?</p>
        <Button variant="outline" className="mt-4" onClick={fetchVideos}>
          Retry
        </Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-border rounded-xl bg-muted/10">
        <div className="p-4 rounded-full bg-muted mb-4">
          <PlayCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No videos yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your first video to get started.
        </p>
        <Link href="/dashboard/upload">
          <Button>Upload Video</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead className="max-sm:hidden">Status</TableHead>
              <TableHead className="max-sm:hidden">Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span
                        className="font-semibold text-foreground truncate max-w-[150px] md:max-w-[300px]"
                        title={video.title} // Tooltip shows full name on hover
                      >
                        {video.title}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] md:max-w-[300px]">
                        {video.filename}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-sm:hidden">
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 dark:border-green-900"
                  >
                    Ready
                  </Badge>
                </TableCell>
                <TableCell className="max-sm:hidden text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {/* Requires: npm install date-fns */}
                    {/* {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })} */}
                    2 hours ago
                  </div>
                </TableCell>
                {/* ACTIONS DROPDOWN */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      {/* View Analysis */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/videos/${video.id}`}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          View Analysis
                        </Link>
                      </DropdownMenuItem>

                      {/* Copy ID */}
                      <DropdownMenuItem
                        onClick={() => handleCopyId(video.id)}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                        Copy Video ID
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Delete (Destructive) */}
                      <DropdownMenuItem
                        onClick={() => handleDelete(video.id)}
                        className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        Delete Video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-border bg-muted/20 p-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {videos.length} videos</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="h-7 text-xs">
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled className="h-7 text-xs">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
