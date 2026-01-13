"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileVideo, Loader2, X, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const UploadZone = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".avi"] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/videos/", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      toast.success("Upload complete! Processing started.");
      setFile(null); // Reset
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        // 1. Drop Zone State
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
            ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50"}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-secondary">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">
                MP4, MOV, or AVI (Max 500MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        // 2. Selected File State
        <div className="border rounded-xl p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileVideo className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {!uploading && (
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    <X className="w-5 h-5" />
                </Button>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
            </div>
          )}

          {!uploading && (
            <Button className="w-full mt-4" onClick={handleUpload}>
              Upload Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadZone;