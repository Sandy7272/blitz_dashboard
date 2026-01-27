import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { RoadmapItem } from "@/types/audit";

interface RoadmapPhaseProps {
  phase: number;
  title: string;
  description?: string;
  items: RoadmapItem[];
  className?: string;
}

const phaseConfig = {
  1: {
    icon: CheckCircle2,
    iconColor: "text-score-excellent",
    bg: "bg-score-excellent/10",
    border: "border-score-excellent/30",
    timeline: "Week 1-2",
  },
  2: {
    icon: Circle,
    iconColor: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
    timeline: "Week 3-4",
  },
  3: {
    icon: Circle,
    iconColor: "text-muted-foreground",
    bg: "bg-secondary",
    border: "border-border",
    timeline: "Month 2+",
  },
};

const impactConfig = {
  high: { icon: ArrowUp, color: "text-score-excellent", label: "High Impact" },
  medium: { icon: Minus, color: "text-warning", label: "Medium Impact" },
  low: { icon: ArrowDown, color: "text-muted-foreground", label: "Low Impact" },
};

const effortConfig = {
  low: "Easy",
  medium: "Moderate",
  high: "Complex",
};

export const RoadmapPhase = ({
  phase,
  title,
  description,
  items,
  className,
}: RoadmapPhaseProps) => {
  const config = phaseConfig[phase as keyof typeof phaseConfig] || phaseConfig[3];
  const Icon = config.icon;

  return (
    <div className={cn(
      "roadmap-phase relative pl-7",
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

      {/* Content */}
      <div className="pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
            Phase {phase}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            {config.timeline}
          </div>
        </div>
        <h4 className="text-base font-semibold text-foreground mb-1">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mb-3">{description}</p>
        )}
        
        <div className="space-y-2">
          {items.map((item, index) => {
            const impact = impactConfig[item.impact];
            const ImpactIcon = impact.icon;
            
            return (
              <div key={index} className="bg-card rounded-lg p-3 border border-border/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium text-foreground mb-0.5">{item.title}</h5>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <ImpactIcon className={cn("w-3 h-3", impact.color)} />
                      <span className={cn("text-[9px] font-medium", impact.color)}>{impact.label}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">{effortConfig[item.effort]} effort</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
