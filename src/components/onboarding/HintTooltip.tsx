import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";

interface HintTooltipProps {
  id: string;
  children: React.ReactNode;
  hint: string;
  position?: "top" | "bottom" | "left" | "right";
  showOnce?: boolean;
  delay?: number;
}

const DISMISSED_HINTS_KEY = "blitz_ai_dismissed_hints";

export function HintTooltip({
  id,
  children,
  hint,
  position = "top",
  showOnce = true,
  delay = 500,
}: HintTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissedHints = JSON.parse(localStorage.getItem(DISMISSED_HINTS_KEY) || "[]");
    const alreadyDismissed = dismissedHints.includes(id);
    
    if (!alreadyDismissed && showOnce) {
      const timer = setTimeout(() => {
        setIsDismissed(false);
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    
    setIsDismissed(alreadyDismissed);
  }, [id, showOnce, delay]);

  const dismissHint = () => {
    setIsVisible(false);
    if (showOnce) {
      const dismissedHints = JSON.parse(localStorage.getItem(DISMISSED_HINTS_KEY) || "[]");
      if (!dismissedHints.includes(id)) {
        dismissedHints.push(id);
        localStorage.setItem(DISMISSED_HINTS_KEY, JSON.stringify(dismissedHints));
      }
      setIsDismissed(true);
    }
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-primary/20",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-primary/20",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-primary/20",
    right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-primary/20",
  };

  if (isDismissed && showOnce) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-[60] ${positionClasses[position]}`}
          >
            <div className="relative bg-primary/10 border border-primary/20 rounded-xl p-3 max-w-[250px] shadow-lg">
              {/* Arrow */}
              <div className={`absolute w-0 h-0 border-[6px] ${arrowClasses[position]}`} />
              
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{hint}</p>
                <button
                  onClick={dismissHint}
                  className="flex-shrink-0 p-1 rounded hover:bg-primary/20 transition-colors"
                  aria-label="Dismiss hint"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
