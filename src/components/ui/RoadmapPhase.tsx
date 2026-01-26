import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface RoadmapItem {
  title: string;
  description?: string;
}

interface RoadmapPhaseProps {
  phase: string;
  title: string;
  timeline: string;
  items: RoadmapItem[];
  status?: "completed" | "current" | "upcoming";
  className?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    iconColor: "text-score-excellent",
    lineColor: "bg-score-excellent",
    bg: "bg-score-excellent/10",
    border: "border-score-excellent/30",
  },
  current: {
    icon: Circle,
    iconColor: "text-accent",
    lineColor: "bg-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
  },
  upcoming: {
    icon: Circle,
    iconColor: "text-muted-foreground",
    lineColor: "bg-border",
    bg: "bg-secondary",
    border: "border-border",
  },
};

export const RoadmapPhase = ({
  phase,
  title,
  timeline,
  items,
  status = "upcoming",
  className,
}: RoadmapPhaseProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "roadmap-phase relative pl-7",
      // Prevent page breaks inside
      "break-inside-avoid",
      className
    )}>
      {/* Timeline line */}
      <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-border" />
      
      {/* Phase indicator */}
      <div className="absolute left-0 top-0.5">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", config.bg, "border", config.border)}>
          <Icon className={cn("w-3.5 h-3.5", config.iconColor)} />
        </div>
      </div>

      {/* Content - compact spacing */}
      <div className="pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
            {phase}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            {timeline}
          </div>
        </div>
        <h4 className="text-base font-semibold text-foreground mb-2">{title}</h4>
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-foreground">{item.title}</span>
                {item.description && (
                  <span className="text-[10px] text-muted-foreground ml-1">— {item.description}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
