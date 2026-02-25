import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

type TourStep = {
  id: string;
  title: string;
  description: string;
  path: string;
};

const STEPS: TourStep[] = [
  {
    id: "listing-kit",
    title: "Listing Kit",
    description: "Generate product listings and push directly to Shopify.",
    path: "/",
  },
  {
    id: "mission-control",
    title: "Mission Control",
    description: "See active missions, results, and system status at a glance.",
    path: "/missions",
  },
  {
    id: "brand-dna",
    title: "Brand DNA",
    description: "Train the agent on your brand voice, colors, and vibe.",
    path: "/brand-dna",
  },
  {
    id: "billing",
    title: "Billing",
    description: "Top up credits and manage your plan.",
    path: "/billing",
  },
  {
    id: "profile",
    title: "Profile",
    description: "Connect Shopify and manage account settings.",
    path: "/profile",
  },
];

interface AppTourProps {
  isOpen: boolean;
  onFinish: () => void;
  onSkip: () => void;
}

export function AppTour({ isOpen, onFinish, onSkip }: AppTourProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [isOpen, step.path, location.pathname, navigate]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const selector = `[data-tour-id="${step.id}"]`;
    const el = document.querySelector(selector) as HTMLElement | null;

    const update = () => {
      if (!el) {
        setTargetRect(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, stepIndex, location.pathname, step.id]);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setTargetRect(null);
    }
  }, [isOpen]);

  const cardPosition = useMemo(() => {
    if (!targetRect) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
    const top = Math.min(targetRect.bottom + 12, window.innerHeight - 220);
    const left = Math.min(targetRect.left, window.innerWidth - 360);
    return { top, left };
  }, [targetRect]);

  if (!isOpen) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[120]">
      {/* Spotlight */}
      {targetRect && (
        <div
          className="pointer-events-none absolute rounded-2xl border border-primary/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all"
          style={{
            top: Math.max(targetRect.top - 8, 8),
            left: Math.max(targetRect.left - 8, 8),
            width: Math.min(targetRect.width + 16, window.innerWidth - 16),
            height: Math.min(targetRect.height + 16, window.innerHeight - 16),
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        className="absolute w-[320px] max-w-[90vw] glass-card p-4 pointer-events-auto"
        style={cardPosition}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Quick Tour
            </p>
            <h4 className="text-lg font-bold">{step.title}</h4>
          </div>
          <button
            onClick={onSkip}
            className="p-1 rounded hover:bg-white/10"
            aria-label="Close tour"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mt-2">{step.description}</p>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>

          {isLast ? (
            <button onClick={onFinish} className="btn-primary text-xs">
              Finish
            </button>
          ) : (
            <button
              onClick={() => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1))}
              className="btn-primary flex items-center gap-2 text-xs"
            >
              Next
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
