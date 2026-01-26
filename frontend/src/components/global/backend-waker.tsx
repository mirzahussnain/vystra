"use client"
import { useEffect, useRef } from "react"
import axios from "axios"
import { toast } from "sonner"

export default function BackendWaker() {
  // We use useRef to track if the toast was actually shown
  // so we don't show a "Success" message for fast loads.
  const toastShownRef = useRef(false)

  useEffect(() => {
    const wakeUpServer = async () => {
      const TOAST_ID = "server-wake-up"

      // 1. Start a timer: If request takes > 2 seconds, show loading toast
      const timer = setTimeout(() => {
        toastShownRef.current = true
        toast.loading("Waking up server (Free Tier)...", {
          description: "This usually takes about 40-50 seconds.",
          id: TOAST_ID, // Force ID so we can update it later
          duration: Infinity, // Don't auto-close while loading
        })
      }, 2000)

      try {
        // 2. Ping the backend
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`)
      } catch (error) {
        console.log("Wake-up ping finished (ignoring error)")
      } finally {
        // 3. Clear the timer immediately
        clearTimeout(timer)

        // 4. If we showed the toast, update it to Success
        if (toastShownRef.current) {
          toast.success("Server is ready!", {
            id: TOAST_ID, // Overwrites the 'loading' toast
            duration: 3000,
          })
        } else {
          // If we didn't show it (fast load), ensure nothing lingers
          toast.dismiss(TOAST_ID)
        }
      }
    }

    wakeUpServer()
  }, [])

  return null // This component renders nothing visually
}