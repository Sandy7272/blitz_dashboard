import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Link as LinkIcon, 
  Wand2, 
  Loader2, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Globe,
  ShoppingBag,
  ChevronLeft,
  Download,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WebsiteAuditPDF } from "@/components/pdf/WebsiteAuditPDF";
import { ProductAuditPDF } from "@/components/pdf/ProductAuditPDF";
import { exportAuditPDF } from "@/components/pdf/pdfExport";
import { websiteAuditMockData } from "@/mock/websiteAuditMock";
import { productAuditMockData } from "@/mock/productAuditMock";
import { WebsiteAuditData, ProductAuditData } from "@/types/audit";
import { Progress } from "@/components/ui/progress";

type AuditType = "website" | "product" | null;
type FlowStep = "select" | "input" | "generating" | "preview";

interface GenerationStage {
  id: string;
  label: string;
  status: "pending" | "active" | "completed";
}

export default function AuditFlow() {
  const [auditType, setAuditType] = useState<AuditType>(null);
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<FlowStep>("select");
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [auditData, setAuditData] = useState<WebsiteAuditData | ProductAuditData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const stages: GenerationStage[] = [
    { id: "crawling", label: "Crawling website", status: "pending" },
    { id: "analyzing", label: "Analyzing content", status: "pending" },
    { id: "scoring", label: "Calculating scores", status: "pending" },
    { id: "generating", label: "Generating report", status: "pending" },
  ];

  // Simulated progress for demo
  useEffect(() => {
    if (step !== "generating") return;
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (progress >= 25 && currentStage < 1) setCurrentStage(1);
    if (progress >= 50 && currentStage < 2) setCurrentStage(2);
    if (progress >= 75 && currentStage < 3) setCurrentStage(3);
    if (progress >= 100) {
      setTimeout(() => {
        // Use mock data for demo
        const data = auditType === "website" 
          ? { ...websiteAuditMockData, websiteName: extractDomain(url) }
          : { ...productAuditMockData, websiteName: extractDomain(url) };
        setAuditData(data);
        setStep("preview");
        toast.success("Audit report generated!");
      }, 500);
    }
  }, [progress, currentStage, auditType, url]);

  const extractDomain = (urlString: string): string => {
    try {
      const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
      return url.hostname;
    } catch {
      return urlString;
    }
  };

  const validateUrl = (urlString: string): boolean => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(urlString);
  };

  const handleSelectType = (type: AuditType) => {
    setAuditType(type);
    setStep("input");
  };

  const handleStartAudit = async () => {
    if (!url.trim() || !validateUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    setError(null);
    setStep("generating");
    setProgress(0);
    setCurrentStage(0);

    // In production, this would call the real API
    // try {
    //   const data = await api.createAuditJob(url);
    //   pollStatus(data.jobId);
    // } catch (e) {
    //   setError("Failed to start audit");
    //   setStep("input");
    // }
  };

  const handleBack = () => {
    if (step === "input") {
      setStep("select");
      setAuditType(null);
    } else if (step === "preview") {
      setStep("select");
      setAuditType(null);
      setAuditData(null);
      setUrl("");
    }
  };

  const handleDownload = async () => {
    toast.info("Generating PDF...");
    await exportAuditPDF();
    toast.success("PDF downloaded!");
  };

  const renderStages = () => (
    <div className="space-y-3 w-full max-w-sm mx-auto">
      {stages.map((stage, i) => {
        const status = i < currentStage ? "completed" : i === currentStage ? "active" : "pending";
        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all",
              status === "active" && "bg-primary/10",
              status === "completed" && "bg-muted"
            )}
          >
            {status === "completed" ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : status === "active" ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
            )}
            <span className={cn(
              "text-sm font-medium",
              status === "active" && "text-primary",
              status === "completed" && "text-foreground",
              status === "pending" && "text-muted-foreground"
            )}>
              {stage.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      {/* Header with back button */}
      {step !== "select" && step !== "generating" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </motion.div>
      )}

      {/* Step 1: Select Audit Type */}
      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                AI-Powered Analysis
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Generate Audit Report
              </h1>
              <p className="text-muted-foreground text-lg">
                Select the type of audit you need
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
              <button
                onClick={() => handleSelectType("website")}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                  "bg-card shadow-card hover:shadow-premium",
                  "border-border/50 hover:border-primary/50"
                )}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Website Audit
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Performance, SEO, UX, security, and conversion analysis
                </p>
                <ArrowRight className="absolute top-6 right-6 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleSelectType("product")}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                  "bg-card shadow-card hover:shadow-premium",
                  "border-border/50 hover:border-primary/50"
                )}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Product Page Audit
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Conversion, content, visuals, trust signals, and CTA analysis
                </p>
                <ArrowRight className="absolute top-6 right-6 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: URL Input */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-lg">
              <div className="text-center mb-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  "bg-primary/10 text-primary"
                )}>
                  {auditType === "website" ? (
                    <Globe className="w-8 h-8" />
                  ) : (
                    <ShoppingBag className="w-8 h-8" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {auditType === "website" ? "Website Audit" : "Product Page Audit"}
                </h2>
                <p className="text-muted-foreground">
                  Enter the URL to analyze
                </p>
              </div>

              <div className="glass-card p-6">
                <div className="relative mb-4">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    placeholder={auditType === "website" ? "https://yourwebsite.com" : "https://store.com/product/..."}
                    className={cn(
                      "input-glass pl-12 py-4 text-base",
                      error && "border-destructive focus:border-destructive"
                    )}
                    onKeyDown={(e) => e.key === "Enter" && handleStartAudit()}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-destructive text-sm mb-4"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <button
                  onClick={handleStartAudit}
                  disabled={!url.trim()}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate Audit Report
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Analysis typically takes 30-60 seconds
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generating */}
        {step === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-lg text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Analyzing {extractDomain(url)}
              </h2>
              <p className="text-muted-foreground mb-8">
                Our AI is performing a comprehensive audit
              </p>

              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {renderStages()}

              <p className="text-xs text-muted-foreground mt-8">
                Estimated time remaining: ~{Math.max(1, Math.round((100 - progress) / 10))}s
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 4: Preview */}
        {step === "preview" && auditData && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Sticky Download Bar */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border py-4 mb-6 -mx-4 px-4 md:-mx-6 md:px-6">
              <div className="flex items-center justify-between max-w-5xl mx-auto">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {auditType === "website" ? "Website Audit Report" : "Product Page Audit Report"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {(auditData as any).websiteName || (auditData as any).productName}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* PDF Preview */}
            <div 
              id="audit-report-content" 
              className="bg-muted rounded-xl overflow-auto mx-auto max-w-5xl"
            >
              {auditType === "website" ? (
                <WebsiteAuditPDF data={auditData as WebsiteAuditData} />
              ) : (
                <ProductAuditPDF data={auditData as ProductAuditData} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
