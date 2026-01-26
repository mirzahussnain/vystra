import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";


const ErrorDisplayer = ({ error }: { error: string }) => {
 
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-red-500">
      <AlertCircle className="w-8 h-8 mb-4" />
      <p>{error ? error : "Failure. Something went wrong"}</p>
      <Button variant="outline" className="mt-4">
        Retry
      </Button>
    </div>
  );
};

export default ErrorDisplayer;
