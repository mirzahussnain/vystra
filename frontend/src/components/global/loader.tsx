import { Loader2 } from "lucide-react";

const Loader = ({text}: {text?: string}) => (
  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
    <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
    <p>{text?text:"Loading...."}.</p>
  </div>
);

export default Loader;
