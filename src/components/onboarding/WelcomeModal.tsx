import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Wand2, Download, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
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

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/workspace?type=apparel"
                onClick={onClose}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Start Creating
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Explore First
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
