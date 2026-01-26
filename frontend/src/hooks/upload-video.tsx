import { useState } from "react";
import axios from "axios";
import { useGetUploadUrlMutation, useConfirmUploadMutation } from "@/store/api/videoApi";
import { toast } from "sonner"; 

export const useVideoUpload = () => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // RTK Query Mutations
  const [getUploadUrl] = useGetUploadUrlMutation();
  const [confirmUpload] = useConfirmUploadMutation();

  const uploadVideo = async (file: File) => {
    setIsUploading(true);
    setProgress(0);

    try {
      // 1. Get Presigned URL
      const { upload_url, video_id } = await getUploadUrl({
        filename: file.name,
        file_size: file.size,
        content_type: file.type,
      }).unwrap();
      
      
      // 2. Upload Directly to S3 (Using Axios for Progress)
     
      await axios.put(upload_url, file, {
        headers: {
          "Content-Type": file.type, // Must match what we sent to backend
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      // 3. Confirm Upload
      await confirmUpload({ video_id }).unwrap();

      toast.success("Upload complete! Processing started.");
      return true;

    } catch (error: any) {
      console.error("Upload failed:", error?.data?.message || error.message || "Unknown error");
      toast.error(error?.data?.detail || "Upload failed. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadVideo, progress, isUploading };
};