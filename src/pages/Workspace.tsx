import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Link as LinkIcon,
  Wand2,
  Loader2,
  Globe,
  ChevronLeft,
  ShoppingBag,
  Download,
} from "lucide-react";
import { CreationWizard } from "@/components/workspace/CreationWizard";
import { toast } from "sonner";

import { WebsiteAuditPDF } from "@/components/pdf/WebsiteAuditPDF";
import { ProductAuditPDF } from "@/components/pdf/ProductAuditPDF";
import { exportAuditPDF } from "@/components/pdf/pdfExport";
import { websiteAuditMockData } from "@/mock/websiteAuditMock";
import { productAuditMockData } from "@/mock/productAuditMock";
import { WebsiteAuditData, ProductAuditData } from "@/types/audit";
import { Progress } from "@/components/ui/progress";

/* ======================
 WORKFLOW CONFIG
====================== */

const workflowTypes = {
  apparel: {
    backendMode: "model_shoot",
    title: "Apparel Photography",
    subtitle: "Professional Product Images",
    description:
      "Transform any clothing or accessory photo into studio-quality imagery.",
  },
  food: {
    backendMode: "food_photography",
    title: "Food Photography",
    subtitle: "Mouth-Watering Visuals",
    description:
      "Turn your dish photos into professional food imagery.",
  },
  audit: {
    backendMode: "audit",
    title: "Site Doctor",
    subtitle: "AI Website & Product Audit",
    description:
      "Generate premium audit reports with actionable insights.",
  },
};

type AuditType = "website" | "product" | null;

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const type =
    (searchParams.get("type") as keyof typeof workflowTypes) || "apparel";

  const workflow = workflowTypes[type];
  const isAudit = type === "audit";

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col px-4 py-4 md:px-6 md:py-6 overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none mb-4 md:mb-6 text-center max-w-4xl mx-auto"
        >
          <p className="text-xs md:text-sm text-primary font-medium mb-1">
            {workflow.subtitle}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {workflow.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base hidden md:block">
            {workflow.description}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-col">
          {isAudit ? (
            <div className="h-full overflow-y-auto">
              <AuditFlow />
            </div>
          ) : (
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 shadow-xl flex-1 flex flex-col min-h-0 overflow-hidden">
              <CreationWizard
                workflowType={type}
                backendMode={workflow.backendMode}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ======================
 SITE DOCTOR FLOW
====================== */

function AuditFlow() {
  const [selectedAudit, setSelectedAudit] = useState<AuditType>(null);
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditData, setAuditData] = useState<WebsiteAuditData | ProductAuditData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const extractDomain = (urlString: string): string => {
    try {
      const parsed = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
      return parsed.hostname;
    } catch {
      return urlString;
    }
  };

  const handleGenerate = () => {
    if (!url.trim() || !selectedAudit) return;

    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Use mock data with extracted domain
      const domain = extractDomain(url);
      if (selectedAudit === "website") {
        setAuditData({ ...websiteAuditMockData, websiteName: domain });
      } else {
        setAuditData({ ...productAuditMockData, websiteName: domain });
      }
      
      setIsGenerating(false);
      setShowPreview(true);
      toast.success("Audit report generated!");
    }, 2500);
  };

  const handleDownload = async () => {
    toast.info("Generating PDF...");
    try {
      await exportAuditPDF();
      toast.success("PDF downloaded!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  /* ===== PDF PREVIEW ===== */
  if (showPreview && auditData) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-white/10 h-full flex flex-col">
        <div className="flex justify-between mb-4 flex-none">
          <button
            onClick={() => {
              setShowPreview(false);
              setAuditData(null);
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button 
            onClick={handleDownload} 
            className="btn-primary px-6 py-2 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div id="audit-report-content" className="bg-muted rounded-xl p-6 flex-1 overflow-y-auto">
          {selectedAudit === "website" && (
            <WebsiteAuditPDF data={auditData as WebsiteAuditData} />
          )}
          {selectedAudit === "product" && (
            <ProductAuditPDF data={auditData as ProductAuditData} />
          )}
        </div>
      </div>
    );
  }

  /* ===== AUDIT TYPE SELECTION ===== */
  if (!selectedAudit) {
    return (
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto h-full items-center">
        <AuditCard
          icon={Globe}
          title="Website Audit"
          desc="Performance, SEO, UX, Security analysis"
          onClick={() => setSelectedAudit("website")}
        />
        <AuditCard
          icon={ShoppingBag}
          title="Product Page Audit"
          desc="Conversion & trust optimization"
          onClick={() => setSelectedAudit("product")}
        />
      </div>
    );
  }

  /* ===== URL INPUT ===== */
  return (
    <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-white/10 shadow-xl mt-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          {selectedAudit === "website" ? (
            <Globe className="w-8 h-8 text-primary" />
          ) : (
            <ShoppingBag className="w-8 h-8 text-primary" />
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">
          {selectedAudit === "website" ? "Website Audit" : "Product Page Audit"}
        </h2>
        <p className="text-muted-foreground">
          Enter the URL to analyze
        </p>
      </div>

      <div className="relative mb-6">
        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={selectedAudit === "website" ? "https://yourwebsite.com" : "https://store.com/product/..."}
          className="input-glass pl-12 py-4 text-lg"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
      </div>

      {isGenerating ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Analyzing...</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating premium audit report...
          </div>
        </div>
      ) : (
        <>
          <button 
            onClick={handleGenerate} 
            disabled={!url.trim()}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-5 h-5" />
            Generate Premium Audit
          </button>
          
          <button
            onClick={() => setSelectedAudit(null)}
            className="w-full mt-4 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Change audit type
          </button>
        </>
      )}
    </div>
  );
}

/* ======================
 AUDIT CARD COMPONENT
====================== */

import { LucideIcon } from "lucide-react";

function AuditCard({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-white/10 text-left hover:border-primary/50 transition-all shadow-xl h-64 flex flex-col justify-center hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-lg">{desc}</p>
    </button>
  );
}
