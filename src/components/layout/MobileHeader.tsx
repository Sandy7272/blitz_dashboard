import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Settings, LogOut, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const mainNavItems = [
  { label: "Dashboard", path: "/", icon: "📊" },
  { label: "Workspace", path: "/workspace", icon: "✨" },
  { label: "History", path: "/history", icon: "📁" },
  { label: "Billing", path: "/billing", icon: "💳" },
  { label: "Profile", path: "/profile", icon: "👤" },
];

const workflowItems = [
  { label: "Apparel Photography", path: "/workspace?type=apparel", icon: "👔" },
  { label: "Food Photography", path: "/workspace?type=food", icon: "🍕" },
  { label: "Site Doctor", path: "/workspace?type=audit", icon: "🔍" },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.includes("?")) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border" />
      
      <div className="relative flex items-center justify-between px-4 py-3 safe-area-top">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center glow-primary-subtle">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-display font-bold text-foreground">
            Blitz AI
          </span>
        </Link>

        {/* Credit Pill & Menu */}
        <div className="flex items-center gap-3">
          <div className="credit-pill text-xs py-1.5 px-3">
            <Zap className="w-3 h-3" />
            1,250
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-xl bg-secondary hover:bg-accent transition-colors">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-sidebar border-sidebar-border p-0"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-sidebar-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Blitz AI</p>
                        <p className="text-xs text-muted-foreground">Pro Plan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Main Nav */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                      Navigation
                    </p>
                    <nav className="space-y-1">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isActive(item.path)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                          {isActive(item.path) && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* Workflows */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                      AI Workflows
                    </p>
                    <nav className="space-y-1">
                      {workflowItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isActive(item.path)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-sidebar-border space-y-2">
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
