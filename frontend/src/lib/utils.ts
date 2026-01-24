import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // 0 = Bytes, 1 = KB, 2 = MB, 3 = GB, 4 = TB
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  // If result is huge (GB), show "GB". If small (MB), show "MB"
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(minutes: number) {
  if (!minutes || minutes === 0) return "0 minutes";
  
  if (minutes < 60) {
    return `${Math.round(minutes)} minutes`;
  } else {
    // Convert to hours with 1 decimal place
    return `${(minutes / 60).toFixed(1)} hrs`;
  }
}