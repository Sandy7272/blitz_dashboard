import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Wand2, 
  History, 
  CreditCard, 
  User, 
  Settings,
  LogOut,
  Zap,
  Fingerprint,
  Hexagon,
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  tooltip: string;
}

const menuItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Mission Control", path: "/" , tooltip: "Overview of your account and stats" },
  { icon: Zap, label: "Deploy Agent", path: "/deploy", tooltip: "Deploy your AI agents" },
  { icon: Fingerprint, label: "Brand DNA", path: "/brand-dna", tooltip: "Manage your brand identity" },
  //{ icon: Library, label: "Asset Factory", path: "/assets", tooltip: "Create and manage your assets" },
  //{ icon: Hexagon, label: "MetaShop 3D", path: "/3d-studio", tooltip: "Create 3D models and scenes" },
  //{ icon: Wand2, label: "Workspace", path: "/workspace", tooltip: "Create and enhance images with AI" },
  //{ icon: History, label: "History", path: "/history", tooltip: "View all your previously generated images" },
  { icon: CreditCard, label: "Billing", path: "/billing", tooltip: "Manage your subscription and buy credits" },
  { icon: User, label: "Profile", path: "/profile", tooltip: "Update your account settings" },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  // Get user initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-screen w-64 bg-background border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-display font-bold text-black text-xl">B</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">⚡️ Blitz Agent</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border space-y-4">
        {/* User Profile Section */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 px-2 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.picture} alt={user.name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        

        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-destructive hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10 w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
