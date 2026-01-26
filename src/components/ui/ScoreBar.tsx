import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  label: string;
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-score-excellent";
  if (score >= 60) return "bg-score-good";
  if (score >= 40) return "bg-score-fair";
  return "bg-score-poor";
};

export const ScoreBar = ({ score, label, className }: ScoreBarProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{score}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", getScoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
