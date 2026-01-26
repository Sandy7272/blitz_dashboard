import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Sun, Moon, Camera, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  preview?: string;
  popular?: boolean;
}

const defaultTemplates: Template[] = [
  {
    id: "studio",
    name: "Studio Clean",
    description: "Professional white background with soft shadows",
    icon: Camera,
    popular: true,
  },
  {
    id: "lifestyle",
    name: "Lifestyle Scene",
    description: "Natural environment with ambient lighting",
    icon: Sun,
  },
  {
    id: "dramatic",
    name: "Dramatic Dark",
    description: "Bold contrast with dark moody backgrounds",
    icon: Moon,
  },
  {
    id: "minimal",
    name: "Minimal Modern",
    description: "Clean lines with subtle gradients",
    icon: Sparkles,
  },
  {
    id: "vibrant",
    name: "Vibrant Pop",
    description: "Colorful backgrounds with high energy",
    icon: Palette,
  },
  {
    id: "auto",
    name: "AI Auto Select",
    description: "Let AI choose the best style for your image",
    icon: Zap,
    popular: true,
  },
];

interface TemplateStepProps {
  selectedTemplate: string | null;
  onSelect: (templateId: string) => void;
  onNext: () => void;
  onBack: () => void;
  templates?: Template[];
}

export function TemplateStep({
  selectedTemplate,
  onSelect,
  onNext,
  onBack,
  templates = defaultTemplates,
}: TemplateStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Choose Your Style
        </h2>
        <p className="text-muted-foreground">
          Select a visual style that matches your brand. Each style is optimized for different use cases.
        </p>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;

          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(template.id)}
              className={cn(
                "relative p-6 rounded-xl text-left transition-all duration-300",
                "border-2 group",
                isSelected
                  ? "border-primary bg-primary/10 shadow-[0_0_30px_hsl(155_100%_59%_/_0.15)]"
                  : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50"
              )}
            >
              {/* Popular badge */}
              {template.popular && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Popular
                </div>
              )}

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                  isSelected
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3
                className={cn(
                  "font-semibold text-base mb-1 transition-colors",
                  isSelected ? "text-foreground" : "text-foreground/90"
                )}
              >
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between pt-4"
      >
        <button onClick={onBack} className="btn-ghost px-6 py-3">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTemplate}
          className={cn(
            "btn-primary px-8 py-4 text-base flex items-center gap-2",
            !selectedTemplate && "opacity-50 cursor-not-allowed"
          )}
        >
          Continue to Options
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </button>
      </motion.div>
    </motion.div>
  );
}
