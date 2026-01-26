import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Sparkles } from "lucide-react";


export default function UserProfileButton() {
  
  
  return (
    <UserButton
      
    >

      <UserButton.MenuItems>
        
        <UserButton.Link
          label="Dashboard"
          labelIcon={<LayoutDashboard size={15} />}
          href="/dashboard"
        />
        
        <UserButton.Link
          label="Upgrade to Pro"
          labelIcon={<Sparkles size={15} />}
          href="/pricing"
        />
        
    
        
        {/* Clerk's default "Sign out" button */}
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
}