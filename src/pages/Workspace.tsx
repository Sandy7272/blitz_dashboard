import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Link as LinkIcon, 
  Wand2, 
  Loader2,
  Info,
  Globe,
  FileText,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FeatureTooltip } from "@/components/onboarding/FeatureTooltip";
import { CreationWizard } from "@/components/workspace/CreationWizard";
import { api } from "@/lib/api";
import { toast } from "sonner";

const workflowTypes = {
  apparel: {
    backendMode: "model_shoot",
    title: "Apparel Photography",
    subtitle: "Professional Product Images",
    description: "Transform any clothing or accessory photo into studio-quality imagery ready for your store.",
  },
  food: {
    backendMode: "food_photography",
    title: "Food Photography",
    subtitle: "Mouth-Watering Visuals",
    description: "Turn your dish photos into professional, appetizing images that drive sales.",
  },
  audit: {
    backendMode: "audit",
    title: "Site Doctor",
    subtitle: "Website Health Check",
    description: "Get a comprehensive audit with actionable improvements for your website.",
  },
};

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as keyof typeof workflowTypes) || "apparel";
  const workflow = workflowTypes[type];
  const isAudit = type === "audit";

  // Audit-specific state
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const pollAuditStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getJobStatus(jobId);
        
        if (data.status === "processing_magic" || data.status === "processing") {
          setProgress((prev) => Math.min(prev + 5, 90));
        }

        if (data.status === "completed") {
          clearInterval(interval);
          setIsGenerating(false);
          setProgress(100);
          setAuditResult(data.result_url || "Audit complete");
          toast.success("Audit complete!");
        } else if (data.status === "failed") {
          clearInterval(interval);
          setIsGenerating(false);
          toast.error("Audit failed. Please try again.");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);
  };

  const handleAuditGenerate = async () => {
    if (!url.trim()) return;
    
    setIsGenerating(true);
    setProgress(5);
    setAuditResult(null);

    try {
      const data = await api.createAuditJob(url);
      setProgress(20);
      pollAuditStatus(data.jobId);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      toast.error("Audit failed. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="text-sm text-primary font-medium mb-1">{workflow.subtitle}</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
            {workflow.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {workflow.description}
          </p>
        </motion.div>

        {/* Content */}
        {isAudit ? (
          // Audit workflow - simplified single-step
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-2">
                  Enter Your Website URL
                </h2>
                <p className="text-muted-foreground text-sm">
                  We'll analyze your site and provide actionable recommendations
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="input-glass pl-12 text-base py-4"
                    disabled={isGenerating}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing your website... {Math.round(progress)}%</span>
                      </div>
                    </motion.div>
                  ) : auditResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-6 bg-primary/10 rounded-xl border border-primary/20"
                    >
                      <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="text-foreground font-semibold mb-2">Audit Complete!</p>
                      <p className="text-muted-foreground text-sm mb-4">
                        Your website analysis is ready
                      </p>
                      <a
                        href={auditResult}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Report
                      </a>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleAuditGenerate}
                      disabled={!url.trim()}
                      className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Wand2 className="w-5 h-5" />
                      Start Website Audit
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {!isGenerating && !auditResult && (
                  <p className="text-center text-xs text-muted-foreground">
                    Uses 10 credits • Results in ~30 seconds
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          // Image workflow - full wizard
          <CreationWizard
            workflowType={type as "apparel" | "food"}
            backendMode={workflow.backendMode}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
