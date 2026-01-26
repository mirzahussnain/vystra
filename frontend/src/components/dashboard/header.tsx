"use client";

import ModeToggle from "@/components/ui/theme-toggler";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ensure you have Avatar installed via Shadcn
import { Bell } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { useGetNotificationsQuery } from "@/store/api/notificationApi";
import NotificationBell from "./bell-icon";
import Logo from "../ui/logo";
import MobileNav from "../global/mobile-nav";
import { MobileNavProps, Notification } from "@/lib/types";
import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoV } from "../ui/logo-vystra";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import UserProfileButton from "../global/user-profile-button";

const navItems: MobileNavProps[] = [
  { label: "Overview", href: "/dashboard", id: undefined },
  { label: "Library", href: "/dashboard/library", id: "library" },
  { label: "Settings", href: "/dashboard/settings", id: "settings" },
];
const Header = () => {
  const [polling, setPolling] = useState(15000);
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const userStats = useSelector((state: RootState) => state.stats);
  const { isLoaded: authLoaded, sessionId } = useAuth();
  const { data: notifications, isLoading: notificationsLoading } =
    useGetNotificationsQuery(undefined, {
      pollingInterval: polling,
      skip: !userLoaded || !authLoaded || !sessionId || !isSignedIn,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  useEffect(() => {
    if (notifications) {
      const hasUnread = notifications.some(
        (notification: Notification) => !notification.is_read,
      );

      setPolling(hasUnread ? 4000 : 15000);
    }
  }, [notifications]);

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left: Breadcrumbs or Page Title (Placeholder) */}
      <div className="hidden md:block font-semibold text-sm text-muted-foreground">
        <Breadcrumbs />
      </div>

      <div className="md:hidden flex items-center gap-2">
        <MobileNav navItems={navItems} type="dashboard" />
        <Link href="/" className="flex items-center  min-w-0">
          <LogoV className="max-w-12" />
          <span className="font-bold text-xl tracking-tight text-foreground">
            ystra
            {/*Insight<span className="text-primary">Stream</span>*/}
          </span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <ModeToggle />

        {notificationsLoading ? (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="w-5 h-5" />
          </Button>
        ) : (
          <NotificationBell notifications={notifications} />
        )}

        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {userStats?.plan.charAt(0).toUpperCase() +
                userStats?.plan.slice(1) +
                " " +
                "Plan"}
            </p>
          </div>
          {userLoaded && user ? (
            <UserProfileButton />
          ) : (
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
