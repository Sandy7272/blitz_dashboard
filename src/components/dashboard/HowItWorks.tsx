import { motion } from "framer-motion";
import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Your Image",
    description: "Drag and drop or select any product photo. We accept JPG, PNG, and WebP formats.",
  },
  {
    step: 2,
    icon: Wand2,
    title: "AI Enhancement",
    description: "Our AI analyzes and transforms your image into professional studio-quality visuals in seconds.",
  },
  {
    step: 3,
    icon: Download,
    title: "Download & Use",
    description: "Get your enhanced image instantly. Ready for your website, marketplace, or marketing.",
  },
];

export function HowItWorks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6 md:mb-10"
    >
      <h2 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 md:mb-6">
        How It Works
      </h2>
      <div className="glass-card p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number badge */}
              <div className="absolute -top-2 -left-2 md:static md:mb-4 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center">
                {item.step}
              </div>
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mt-4 md:mt-0">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-base font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              
              {/* Connector line (hidden on mobile, visible between items on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
