import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeatureTooltipProps {
  children: ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  delayDuration?: number;
}

export function FeatureTooltip({
  children,
  content,
  side = "top",
  delayDuration = 300,
}: FeatureTooltipProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent 
        side={side} 
        className="bg-popover border-border text-sm max-w-[200px]"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
