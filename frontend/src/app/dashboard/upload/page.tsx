import UploadZone  from "@/components/dashboard/upload-zone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UploadPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload Video</h1>
        <p className="text-muted-foreground">
          Add new content to your transcription library.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Drag & Drop</CardTitle>
            <CardDescription>
                We support MP4, MOV, and AVI files up to 500MB.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {/* The component we built earlier */}
            <UploadZone />
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadPage;