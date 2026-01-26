import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

type Severity = "critical" | "warning" | "info";

interface IssueItemProps {
  title: string;
  description?: string;
  severity: Severity;
  className?: string;
}

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    iconColor: "text-destructive",
    label: "Critical",
    labelBg: "bg-destructive",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconColor: "text-warning",
    label: "Warning",
    labelBg: "bg-warning",
  },
  info: {
    icon: Info,
    bg: "bg-info/10",
    border: "border-info/30",
    iconColor: "text-info",
    label: "Info",
    labelBg: "bg-info",
  },
};

export const IssueItem = ({
  title,
  description,
  severity,
  className,
}: IssueItemProps) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        // Core layout - flexible height based on content
        "issue-item flex items-start gap-3 p-3 rounded-lg border",
        // Styling based on severity
        config.bg,
        config.border,
        // Prevent page breaks inside
        "break-inside-avoid",
        className
      )}
    >
      <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.iconColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white", config.labelBg)}>
            {config.label}
          </span>
        </div>
        <h4 className="font-medium text-sm text-foreground leading-tight">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};
