import { cn } from "@/lib/utils";
import { Lightbulb, Sparkles } from "lucide-react";

interface RecommendationBoxProps {
  title: string;
  description: string;
  type?: "tip" | "ai";
  className?: string;
}

export const RecommendationBox = ({
  title,
  description,
  type = "tip",
  className,
}: RecommendationBoxProps) => {
  const isAI = type === "ai";

  return (
    <div
      className={cn(
        // Compact padding for PDF
        "recommendation-box p-4 rounded-lg border",
        isAI
          ? "bg-accent/5 border-accent/20"
          : "bg-secondary/50 border-border/50",
        // Prevent page breaks inside
        "break-inside-avoid",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-1.5 rounded-lg flex-shrink-0",
            isAI ? "bg-accent/10" : "bg-primary/10"
          )}
        >
          {isAI ? (
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Lightbulb className="w-3.5 h-3.5 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
