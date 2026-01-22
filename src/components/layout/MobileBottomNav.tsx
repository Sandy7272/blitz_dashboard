import { 
  LayoutDashboard, 
  Wand2, 
  History, 
  CreditCard, 
  User
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: Wand2, label: "Create", path: "/workspace" },
  { icon: History, label: "History", path: "/history" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border" />
      
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`} 
              />
              <span 
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
