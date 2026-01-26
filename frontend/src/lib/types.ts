export type PlanId = "free" | "pro" | "enterprise";

export interface Video {
  id: string;
  title: string,
  created_at: Date,
  description?: string,
  status: string,
  transcript?: string,
  segments?: Array<object>
  ai_title?: string,
  summary?: string,
  key_takeaways?: Array<string>,
  actions_items?: Array<string>
}

export interface VideoListProps{
  videos: Video[],
  isLoading: boolean,
  isError: boolean,
}



export interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  video_id?: string;
  type?: "success" | "error" | "info"; // Added type definition
  created_at: string;
}

export interface NotificationBellProps {
  notifications: Notification[];
}

export interface TranscriptViewProps {
  segments: { start: number; end: number; text: string }[];
  currentTime: number;
  onSeek: (time: number) => void;
  video_Id?: string;
  isPro?:boolean
}

export interface AnalysisData {
  ai_title: string;
  summary: string;
  transcriptData?: TranscriptViewProps
  action_items: string[];
  key_takeaways: string[];
}

export interface MobileNavProps{
  id?:string,
  label: string,
  href: string,
  icon?: React.ReactNode,
}