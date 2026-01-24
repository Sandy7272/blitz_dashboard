import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WorkflowCard } from "@/components/dashboard/WorkflowCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { HowItWorks } from "@/components/dashboard/HowItWorks";
import { Shirt, UtensilsCrossed, Search, ImageIcon, Zap, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const workflows = [
  {
    title: "Apparel Photography",
    description: "Turn simple product photos into stunning e-commerce visuals. Perfect for fashion, clothing, and accessories.",
    icon: Shirt,
    credits: 5,
    gradient: "gradient-primary",
    path: "/workspace?type=apparel",
  },
  {
    title: "Food Photography",
    description: "Make your dishes look irresistible. Ideal for restaurants, food delivery apps, and recipe blogs.",
    icon: UtensilsCrossed,
    credits: 5,
    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
    path: "/workspace?type=food",
  },
  {
    title: "Site Doctor",
    description: "Get a complete website health check. Receive clear, actionable suggestions to improve user experience.",
    icon: Search,
    credits: 10,
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    path: "/workspace?type=audit",
  },
];

const stats = [
  { title: "Images Created", value: "1,247", change: "+12%", changeType: "positive" as const, icon: ImageIcon },
  { title: "Credits Available", value: "8,350", change: "-5%", changeType: "neutral" as const, icon: Zap },
  { title: "Processing Time", value: "2.4s", change: "-0.3s", changeType: "positive" as const, icon: Clock },
  { title: "Success Rate", value: "99.2%", change: "+0.5%", changeType: "positive" as const, icon: TrendingUp },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Header with improved copy */}
      <div className="mb-6 md:mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2"
        >
          Create Professional Images in Seconds
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-muted-foreground mb-4"
        >
          Upload any product photo and let AI transform it into studio-quality visuals. No design skills needed.
        </motion.p>
        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link 
            to="/workspace?type=apparel"
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            Start Creating Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
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

      {/* Workflows Section with better heading */}
      <div className="mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 md:mb-6"
        >
          <h2 className="text-lg md:text-xl font-display font-semibold text-foreground">
            Choose Your Workflow
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select the tool that matches your needs. Each workflow is optimized for specific use cases.
          </p>
        </motion.div>
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

      {/* How It Works Section */}
      <HowItWorks />

      {/* Recent Activity with better empty state */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4 md:mb-6">
          Your Recent Work
        </h2>
        <div className="glass-card p-6">
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center max-w-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium text-foreground mb-1">No images yet</p>
              <p className="text-sm mb-4">
                Your generated images will appear here. Start by uploading a product photo above.
              </p>
              <Link 
                to="/workspace?type=apparel"
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                Create Your First Image
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
