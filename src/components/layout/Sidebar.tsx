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
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FeatureTooltip } from "@/components/onboarding/FeatureTooltip";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  tooltip: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", tooltip: "Overview of your account and quick access to all tools" },
  { icon: Wand2, label: "Workspace", path: "/workspace", tooltip: "Create and enhance images with AI" },
  { icon: History, label: "History", path: "/history", tooltip: "View all your previously generated images" },
  { icon: CreditCard, label: "Billing", path: "/billing", tooltip: "Manage your subscription and buy credits" },
  { icon: User, label: "Profile", path: "/profile", tooltip: "Update your account settings" },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: "Settings", path: "/settings", tooltip: "App preferences and configuration" },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const resetOnboarding = () => {
    localStorage.removeItem("blitz_ai_onboarding_complete");
    localStorage.removeItem("blitz_ai_dismissed_hints");
    window.location.reload();
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 hidden lg:flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary-subtle">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-display font-bold text-foreground"
            >
              Blitz AI
            </motion.span>
          )}
        </Link>
        <FeatureTooltip content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} side="right">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </FeatureTooltip>
      </div>

      {/* Credit Balance */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-6"
        >
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Credits</span>
              <FeatureTooltip content="You're on the Pro plan with priority support" side="right">
                <span className="credit-pill text-xs cursor-help">PRO</span>
              </FeatureTooltip>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-display font-bold text-foreground">1,250</span>
              <span className="text-sm text-muted-foreground">remaining</span>
            </div>
            <FeatureTooltip content="Get more credits or upgrade your plan" side="right">
              <Link
                to="/billing"
                className="mt-3 w-full btn-primary text-center block text-xs py-2"
              >
                Upgrade Plan
              </Link>
            </FeatureTooltip>
          </div>
        </motion.div>
      )}

      {/* Collapsed Credit Indicator */}
      {isCollapsed && (
        <FeatureTooltip content="1,250 credits remaining" side="right">
          <div className="mx-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 text-center cursor-help">
              <Zap className="w-5 h-5 text-primary mx-auto" />
            </div>
          </div>
        </FeatureTooltip>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const linkContent = (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? "active" : ""} ${
                isCollapsed ? "justify-center px-3" : ""
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );

          if (isCollapsed) {
            return (
              <FeatureTooltip key={item.path} content={item.tooltip} side="right">
                {linkContent}
              </FeatureTooltip>
            );
          }
          return linkContent;
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 pb-4 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const linkContent = (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? "active" : ""} ${
                isCollapsed ? "justify-center px-3" : ""
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );

          if (isCollapsed) {
            return (
              <FeatureTooltip key={item.path} content={item.tooltip} side="right">
                {linkContent}
              </FeatureTooltip>
            );
          }
          return linkContent;
        })}
        
        {/* Help / Reset Onboarding */}
        {!isCollapsed && (
          <button
            onClick={resetOnboarding}
            className="sidebar-item w-full text-muted-foreground hover:text-foreground"
            title="Show welcome guide again"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <span>Help & Tour</span>
          </button>
        )}
        
        <FeatureTooltip content="Sign out of your account" side="right">
          <button
            className={`sidebar-item w-full text-destructive hover:bg-destructive/10 ${
              isCollapsed ? "justify-center px-3" : ""
            }`}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </FeatureTooltip>
      </div>
    </motion.aside>
  );
}

