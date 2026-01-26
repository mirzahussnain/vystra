export type PlanId = "free" | "pro" | "enterprise";


export type RTQApiError = {
  data?: {
    detail?: string;
  };
  message?: string;
};
export interface Video {
  id: string;
  title: string,
  created_at: Date,
  description?: string,
  status: string,
  transcript?: string,
  segments?: { start: number; end: number; text: string }[];
  ai_title?: string,
  summary?: string,
  key_takeaways?: Array<string>,
  actions_items?: Array<string>,
  searchBlob?: string
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

export interface UserStats {
  id: string;
  plan: string;
  storage: {
    used_bytes: number;
    limit_bytes: number;
    percent: number;
    is_full: boolean;
  };
  processing: {
    used_minutes: number;
    limit_minutes: number;
    percent: number;
    is_full: boolean;
  };
  ai_credits: {
    used_actions: number;
    limit_actions: number;
    remaining: number;
    is_empty: boolean;
  };
}
