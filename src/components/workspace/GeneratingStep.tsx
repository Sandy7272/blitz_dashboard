import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, Wand2, Sparkles, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratingStepProps {
  progress: number;
  status: "uploading" | "processing" | "rendering" | "completed" | "failed";
  onCancel: () => void;
}

const stages = [
  { id: "uploading", label: "Uploading image", icon: Upload, threshold: 15 },
  { id: "processing", label: "AI processing", icon: Wand2, threshold: 60 },
  { id: "rendering", label: "Rendering output", icon: Sparkles, threshold: 90 },
  { id: "completed", label: "Complete!", icon: CheckCircle2, threshold: 100 },
];

export function GeneratingStep({ progress, status, onCancel }: GeneratingStepProps) {
  const [eta, setEta] = useState(30);

  // Simulate ETA countdown
  useEffect(() => {
    if (status === "completed" || status === "failed") return;
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const currentStage = stages.find((s) => progress <= s.threshold) || stages[stages.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
    >
      {/* Animated loader */}
      {/* Added p-4 to ensure the large glow shadow doesn't get clipped by parent overflows */}
      <div className="relative p-4">
        <motion.div
          // Removed 'border-4 border-primary/20' to fix clipping artifacts
          className="w-32 h-32 rounded-full relative"
          style={{
            // Updated gradient: Paint the progress color, then the track color immediately after
            background: `conic-gradient(hsl(var(--primary)) ${progress * 3.6}deg, hsl(var(--primary) / 0.2) 0deg)`,
          }}
        >
          {/* Adjusted inset to create the ring thickness (inset-2 = 8px thickness, roughly matching border-4 + padding) */}
          <div className="absolute inset-1.5 rounded-full bg-background flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {status === "failed" ? (
                  <div className="text-destructive">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                ) : status === "completed" ? (
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                ) : (
                  <currentStage.icon className="w-10 h-10 text-primary animate-pulse" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          // Adjusted inset to match the new padding so the glow aligns perfectly
          className="absolute inset-4 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px hsl(155 100% 59% / 0.2)",
              "0 0 40px hsl(155 100% 59% / 0.4)",
              "0 0 20px hsl(155 100% 59% / 0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <motion.h3
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-display font-bold text-foreground"
        >
          {status === "failed" ? "Generation Failed" : currentStage.label}
        </motion.h3>
        
        {status !== "completed" && status !== "failed" && (
          <p className="text-muted-foreground">
            {eta > 0 ? `Estimated time remaining: ~${eta}s` : "Almost there..."}
          </p>
        )}

        {status === "failed" && (
          <p className="text-muted-foreground">
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{Math.round(progress)}%</span>
          <span>{status === "completed" ? "Done!" : "Processing..."}</span>
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex items-center gap-4">
        {stages.slice(0, -1).map((stage, index) => {
          const Icon = stage.icon;
          const isActive = progress >= (index === 0 ? 0 : stages[index - 1].threshold);
          const isComplete = progress >= stage.threshold;

          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                isComplete
                  ? "bg-primary/20 text-primary"
                  : isActive
                  ? "bg-secondary text-foreground"
                  : "bg-secondary/50 text-muted-foreground"
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Icon className={cn("w-3.5 h-3.5", isActive && "animate-pulse")} />
              )}
              <span className="hidden sm:inline">{stage.label}</span>
            </div>
          );
        })}
      </div>

      {/* Cancel button */}
      {status !== "completed" && status !== "failed" && (
        <button
          onClick={onCancel}
          className="btn-ghost text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      )}
    </motion.div>
  );
}