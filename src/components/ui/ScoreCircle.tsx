import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: "w-16 h-16", text: "text-lg", stroke: 4, label: "text-xs" },
  md: { container: "w-24 h-24", text: "text-2xl", stroke: 5, label: "text-sm" },
  lg: { container: "w-32 h-32", text: "text-3xl", stroke: 6, label: "text-sm" },
  xl: { container: "w-44 h-44", text: "text-5xl", stroke: 8, label: "text-base" },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "stroke-score-excellent";
  if (score >= 60) return "stroke-score-good";
  if (score >= 40) return "stroke-score-fair";
  return "stroke-score-poor";
};

const getScoreTextColor = (score: number) => {
  if (score >= 80) return "text-score-excellent";
  if (score >= 60) return "text-score-good";
  if (score >= 40) return "text-score-fair";
  return "text-score-poor";
};

export const ScoreCircle = ({
  score,
  size = "md",
  label,
  showPercentage = true,
  className,
}: ScoreCircleProps) => {
  const config = sizeMap[size];
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", config.container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-secondary"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={cn(getScoreColor(score), "transition-all duration-700 ease-out")}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", config.text, getScoreTextColor(score))}>
            {score}
            {showPercentage && <span className="text-[0.5em] font-medium">%</span>}
          </span>
        </div>
      </div>
      {label && (
        <span className={cn("font-medium text-muted-foreground", config.label)}>
          {label}
        </span>
      )}
    </div>
  );
};
