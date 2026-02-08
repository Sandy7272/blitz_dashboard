import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { AppTour } from "@/components/onboarding/AppTour";
import { motion } from "framer-motion";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuthApiSetup } from "@/hooks/useAuthApiSetup";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { showWelcome, completeOnboarding, showTour, completeTour, skipTour } = useOnboarding();
  
  // Set up auth token injection for API calls
  useAuthApiSetup();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background gradient-radial">
        {/* Welcome Modal for first-time users */}
        <WelcomeModal
          isOpen={showWelcome}
          onClose={() => completeOnboarding(true)}
          onStartTour={() => completeOnboarding(true)}
          onSkipTour={() => {
            completeOnboarding(false);
            skipTour();
          }}
        />
        <AppTour isOpen={showTour} onFinish={completeTour} onSkip={completeTour} />
        
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Mobile Header */}
        <MobileHeader />
        
        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen transition-all duration-300">
          {/* Mobile top padding for fixed header */}
          <div className="pt-16 pb-24 lg:pt-0 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 md:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </TooltipProvider>
  );
}
