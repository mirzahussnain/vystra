import { toast } from "sonner";
import { Button } from "./button";
import {Clipboard} from "lucide-react";
const ClipButton = ({ text, tabName}: { text: string, tabName?: string }) => {


  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.info(`Copied ${tabName || 'content'} to clipboard`);
  };

    return (
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center justify-center "
        title={`Copy ${tabName || 'content'} to Clipboard`}>
                <Clipboard className="w-4 h-4 md:mr-2" /><span className="hidden md:block">Copy {tabName}</span>
              </Button>
    );
}

export default ClipButton;