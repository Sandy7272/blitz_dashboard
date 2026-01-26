import { cn } from "@/lib/utils";
import { Check, X, Minus } from "lucide-react";

type Status = "pass" | "fail" | "partial";

interface StatusIndicatorProps {
  label: string;
  status: Status;
  details?: string;
  className?: string;
}

const statusConfig = {
  pass: {
    icon: Check,
    bg: "bg-score-excellent",
    text: "Passed",
  },
  fail: {
    icon: X,
    bg: "bg-destructive",
    text: "Failed",
  },
  partial: {
    icon: Minus,
    bg: "bg-warning",
    text: "Partial",
  },
};

export const StatusIndicator = ({
  label,
  status,
  details,
  className,
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center justify-between py-2 border-b border-border/50 last:border-0",
      "break-inside-avoid",
      className
    )}>
      <div className="flex-1 min-w-0 pr-3">
        <p className="font-medium text-sm text-foreground">{label}</p>
        {details && <p className="text-xs text-muted-foreground mt-0.5 truncate">{details}</p>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs text-muted-foreground">{config.text}</span>
        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", config.bg)}>
          <Icon className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
};
