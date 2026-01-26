import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ScoreCircle } from "./ScoreCircle";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-score-excellent/10";
  if (score >= 60) return "bg-score-good/10";
  if (score >= 40) return "bg-score-fair/10";
  return "bg-score-poor/10";
};

const getScoreIconColor = (score: number) => {
  if (score >= 80) return "text-score-excellent";
  if (score >= 60) return "text-score-good";
  if (score >= 40) return "text-score-fair";
  return "text-score-poor";
};

export const ScoreCard = ({
  title,
  score,
  icon: Icon,
  description,
  className,
}: ScoreCardProps) => {
  return (
    <div
      className={cn(
        // Core layout - compact for PDF
        "score-card bg-card rounded-lg p-4 shadow-card border border-border/50",
        "flex items-center gap-4",
        // Prevent page breaks inside
        "break-inside-avoid",
        className
      )}
    >
      <div className={cn("p-2.5 rounded-lg flex-shrink-0", getScoreBg(score))}>
        <Icon className={cn("w-5 h-5", getScoreIconColor(score))} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        )}
      </div>
      <ScoreCircle score={score} size="sm" showPercentage={false} />
    </div>
  );
};
