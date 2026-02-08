import { useState, useEffect } from "react";

const ONBOARDING_KEY = "blitz_ai_onboarding_complete";
const TOOLTIPS_DISMISSED_KEY = "blitz_ai_tooltips_dismissed";
const TOUR_KEY = "blitz_ai_tour_complete";

export function useOnboarding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [tooltipsDismissed, setTooltipsDismissed] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourComplete, setTourComplete] = useState(false);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
    const tooltipsDone = localStorage.getItem(TOOLTIPS_DISMISSED_KEY);
    const tourDone = localStorage.getItem(TOUR_KEY);
    
    if (!onboardingComplete) {
      setShowWelcome(true);
    }
    if (onboardingComplete && tourDone !== "true") {
      setShowTour(true);
    }

    setTooltipsDismissed(tooltipsDone === "true");
    setTourComplete(tourDone === "true");
  }, []);

  const completeOnboarding = (startTour = true) => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowWelcome(false);
    if (startTour && !tourComplete) {
      setShowTour(true);
    }
  };

  const dismissTooltips = () => {
    localStorage.setItem(TOOLTIPS_DISMISSED_KEY, "true");
    setTooltipsDismissed(true);
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_KEY, "true");
    setShowTour(false);
    setTourComplete(true);
  };

  const skipTour = () => {
    localStorage.setItem(TOUR_KEY, "true");
    setShowTour(false);
    setTourComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(TOOLTIPS_DISMISSED_KEY);
    localStorage.removeItem(TOUR_KEY);
    setShowWelcome(true);
    setTooltipsDismissed(false);
    setShowTour(false);
    setTourComplete(false);
  };

  return {
    showWelcome,
    tooltipsDismissed,
    showTour,
    tourComplete,
    completeOnboarding,
    dismissTooltips,
    completeTour,
    skipTour,
    resetOnboarding,
  };
}
