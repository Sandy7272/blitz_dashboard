import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface WorkflowCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  credits: number;
  gradient: string;
  path: string;
  delay?: number;
}

export function WorkflowCard({
  title,
  description,
  icon: Icon,
  credits,
  gradient,
  path,
  delay = 0,
}: WorkflowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={path} className="block group">
        <div className="workflow-card h-full">
          {/* Icon with gradient background */}
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 ${gradient}`}
          >
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
          </div>

          {/* Content */}
          <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 md:mb-6 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
            <span className="text-xs md:text-sm text-muted-foreground">
              <span className="text-primary font-medium">{credits}</span> credits/image
            </span>
            <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Start
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
