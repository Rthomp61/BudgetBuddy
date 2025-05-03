import { Link, useLocation } from "wouter";
import { HomeIcon, CalendarIcon, SettingsIcon, UserIcon } from "lucide-react";

export default function Footer() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4 shadow-md">
      <div className="flex justify-around">
        <Link href="/">
          <button className={`flex flex-col items-center ${isActive("/") ? "text-primary-500" : "text-gray-500"}`}>
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
        </Link>
        
        <Link href="/future">
          <button className={`flex flex-col items-center ${isActive("/future") ? "text-primary-500" : "text-gray-500"}`}>
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Future</span>
          </button>
        </Link>
        
        <Link href="/settings">
          <button className={`flex flex-col items-center ${isActive("/settings") ? "text-primary-500" : "text-gray-500"}`}>
            <SettingsIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </Link>
        
        <Link href="/profile">
          <button className={`flex flex-col items-center ${isActive("/profile") ? "text-primary-500" : "text-gray-500"}`}>
            <UserIcon className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </Link>
      </div>
    </footer>
  );
}
