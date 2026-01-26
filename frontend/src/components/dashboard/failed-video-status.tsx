import { AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDeleteVideoMutation } from "@/store/api/videoApi";
import { toast } from "sonner";
import Loader from "../global/loader";

export function FailedVideoState({ reason, id }: { reason?: string, id?: string }) {
  const router = useRouter();
    const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();
  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteVideo(id).unwrap();
      toast.success("Video Deleted", {
        description: "Video removed from your library"
      });
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };
  
  if (isDeleting) {
    return (
     <Loader text={"Deleting video..."} />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Processing Failed</h2>
        <p className="text-muted-foreground">
          {reason || "This video could not be processed due to plan limits or a technical error."}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
        <Button variant="destructive"
          onClick={() => handleDelete(id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Video
        </Button>
      </div>
    </div>
  );
}