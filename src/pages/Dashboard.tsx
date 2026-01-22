import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkflowCard } from "@/components/dashboard/WorkflowCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Shirt, UtensilsCrossed, Search, ImageIcon, Zap, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const workflows = [
  {
    title: "Apparel Photography",
    description: "Transform product photos into stunning studio-quality images. Perfect for fashion brands and e-commerce.",
    icon: Shirt,
    credits: 5,
    gradient: "gradient-primary",
    path: "/workspace?type=apparel",
  },
  {
    title: "Food Photography",
    description: "Enhance food images with professional lighting and styling. Make every dish look irresistible.",
    icon: UtensilsCrossed,
    credits: 5,
    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
    path: "/workspace?type=food",
  },
  {
    title: "Site Doctor",
    description: "AI-powered website audit. Analyze UX, performance, accessibility, and get actionable improvements.",
    icon: Search,
    credits: 10,
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    path: "/workspace?type=audit",
  },
];

const stats = [
  { title: "Images Generated", value: "1,247", change: "+12%", changeType: "positive" as const, icon: ImageIcon },
  { title: "Credits Used", value: "8,350", change: "-5%", changeType: "neutral" as const, icon: Zap },
  { title: "Avg. Processing", value: "2.4s", change: "-0.3s", changeType: "positive" as const, icon: Clock },
  { title: "Success Rate", value: "99.2%", change: "+0.5%", changeType: "positive" as const, icon: TrendingUp },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2"
        >
          Welcome back, Creator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-muted-foreground"
        >
          Choose a workflow to get started or continue your recent projects.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
            delay={0.1 + index * 0.05}
          />
        ))}
      </div>

      {/* Workflows Section */}
      <div className="mb-6 md:mb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 md:mb-6"
        >
          AI Workflows
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {workflows.map((workflow, index) => (
            <WorkflowCard
              key={workflow.title}
              {...workflow}
              delay={0.3 + index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">
          Recent Activity
        </h2>
        <div className="glass-card p-6">
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity yet</p>
              <p className="text-sm mt-1">Start creating to see your history here</p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
