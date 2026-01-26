'use client'

import { CheckCircle2, XCircle, Info, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMarkAllAsReadMutation, useMarkNotificationAsReadMutation } from "@/store/api/notificationApi";
import { toast } from "sonner";
import Link from "next/link";
import { Notification, NotificationBellProps } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { set } from "date-fns";



// 1. FIX: Destructure props correctly

const NotificationBell = ({ notifications = [] }: NotificationBellProps) => {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Notification | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isErrorModalOpen,setIsErrorModalOpen] = useState(false);
  const [markAllAsRead, { isLoading }] = useMarkAllAsReadMutation();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  
  // 2. LOGIC: Calculate dynamic unread count
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const hasUnread = unreadCount > 0;

  const getIcon = (type: string = "info") => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "error": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBgColor = (type: string = "info", isRead: boolean) => {
    if (isRead) return "bg-popover";
    switch (type) {
      case "success": return "bg-red-50";
      case "error": return "bg-red-50";
      default: return "bg-blue-50";
    }
  };
  
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(undefined).unwrap();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
      console.error(error);
    }
  }
  
  const handleNotificationClick = async (n:Notification) => {
    if (!n.is_read) {
      markNotificationAsRead(n.id);
    }
    
    if(n.type==='error' || !n.video_id){
     
      setSelectedNote(n); // Save data to show in modal
      setIsErrorModalOpen(true); // Open the modal
      setIsOpen(false); // Close the Bell Popover
    }
   
    else {
      setIsOpen(false); // Close Popover
     router.push(`/dashboard/videos/${n.video_id}`);
    }
  }
  return (
    <>
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground cursor-pointer">
          <Bell className="w-5 h-5" />
          
        
          {hasUnread && (
            <div className="absolute top-0 right-0.5 w-3.5 h-3.5 bg-red-400/80 rounded-full text-[10px] text-white flex items-center justify-center border">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-97 max-sm:w-72 p-0" align="end">
        <div className="p-4 border-b font-semibold bg-glass flex justify-between items-center">
          <span>Notifications</span>
          {hasUnread && (
            <Button variant={'outline'} className="text-xs text-primary cursor-pointer "
            onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-auto rounded-b-xl">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                onClick={()=>handleNotificationClick(n)}
                key={n.id}
                className={`py-3 px-4 w-fit overflow-x-auto border-t-2 border-border text-sm cursor-pointer hover:bg-border flex gap-3 items-start transition-colors ${getBgColor(n.type, n.is_read)}`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <p className={`font-medium w-full overflow-x-hidden text-ellipsis ${n.type === "error" ? "text-red-700" : "text-ring"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleTimeString()}
                  </p>
                </div>
                {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
    {/* 3. THE ERROR/INFO MODAL */}
          <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className={selectedNote?.type === 'error' ? "text-red-600" : ""}>
                   {selectedNote?.type === 'error' ? "Processing Failed" : "Notification"}
                </DialogTitle>
                <DialogDescription className="pt-4 whitespace-pre-wrap text-foreground">
                   {selectedNote?.message}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
  </>
  );
};

export default NotificationBell;