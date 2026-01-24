import { useState, useEffect } from "react";

const ONBOARDING_KEY = "blitz_ai_onboarding_complete";
const TOOLTIPS_DISMISSED_KEY = "blitz_ai_tooltips_dismissed";

export function useOnboarding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [tooltipsDismissed, setTooltipsDismissed] = useState(true);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
    const tooltipsDone = localStorage.getItem(TOOLTIPS_DISMISSED_KEY);
    
    if (!onboardingComplete) {
      setShowWelcome(true);
    }
    
    setTooltipsDismissed(tooltipsDone === "true");
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowWelcome(false);
  };

  const dismissTooltips = () => {
    localStorage.setItem(TOOLTIPS_DISMISSED_KEY, "true");
    setTooltipsDismissed(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(TOOLTIPS_DISMISSED_KEY);
    setShowWelcome(true);
    setTooltipsDismissed(false);
  };

  return {
    showWelcome,
    tooltipsDismissed,
    completeOnboarding,
    dismissTooltips,
    resetOnboarding,
  };
}
