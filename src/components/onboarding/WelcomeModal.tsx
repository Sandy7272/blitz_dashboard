import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Wand2, Download, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour?: () => void;
  onSkipTour?: () => void;
}

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Drag and drop any product photo to get started",
  },
  {
    icon: Wand2,
    title: "AI Does the Work",
    description: "Our AI transforms it into a professional image",
  },
  {
    icon: Download,
    title: "Download & Use",
    description: "Get your enhanced image ready for your store",
  },
];

export function WelcomeModal({ isOpen, onClose, onStartTour, onSkipTour }: WelcomeModalProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const saveProfile = () => {
    if (!country) {
      setError("Country is required to show the right payment options.");
      return false;
    }
    setError("");
    try {
      localStorage.setItem(
        "blitz_user_profile",
        JSON.stringify({ name: name.trim(), country })
      );
    } catch {
      // Ignore storage failures and still proceed
    }
    return true;
  };

  const handleStartTour = () => {
    if (!saveProfile()) return;
    (onStartTour || onClose)();
  };

  const handleSkipTour = () => {
    if (!saveProfile()) return;
    (onSkipTour || onClose)();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg glass-card p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Close welcome modal"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-primary-subtle">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Welcome to Blitz AI
              </h2>
              <p className="text-muted-foreground">
                Create professional product images in seconds. Here's how it works:
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      <span className="text-primary mr-2">{index + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Onboarding Details */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mukul"
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Country (required)</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-glass w-full"
                >
                  <option value="">Select country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Country is required to show the right payment options (e.g., UPI in India).
                </p>
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartTour}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Take Quick Tour
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSkipTour}
                className="btn-secondary flex-1"
              >
                Skip Tour
              </button>
            </div>

            {/* Tip */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              💡 Tip: You get <span className="text-primary font-medium">500 free credits</span> to start
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
