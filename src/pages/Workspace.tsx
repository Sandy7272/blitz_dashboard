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
} from "lucide-react";
import { CreationWizard } from "@/components/workspace/CreationWizard";
import { toast } from "sonner";

import { WebsiteAuditPDF } from "@/components/pdf/WebsiteAuditPDF";
import { ProductAuditPDF } from "@/components/pdf/ProductAuditPDF";
import { exportAuditPDF } from "@/components/pdf/pdfExport";

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
      {/* LAYOUT FIX: 
        1. h-full: Takes full height of the dashboard main area
        2. flex-col: Stacks header and content vertically
        3. overflow-hidden: Prevents window-level scrolling 
      */}
      <div className="w-full h-full flex flex-col px-4 py-4 md:px-6 md:py-6 overflow-hidden">

        {/* ===== HEADER (Fixed Height) ===== */}
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

        {/* ===== MAIN CONTENT WRAPPER (Flexible Height) ===== */}
        {/* flex-1: Fills strictly the remaining space
           min-h-0: Crucial for nested scrolling to work
        */}
        <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-col">

          {isAudit ? (
            <div className="h-full overflow-y-auto">
              <AuditFlow />
            </div>
          ) : (
            // WIZARD CONTAINER
            // Added flex-col and h-full to the card to contain the wizard components
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
  const [auditData, setAuditData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const mockAuditData = {
    siteName: "Example Store",
    score: 78,
  };

  const handleGenerate = () => {
    if (!url.trim() || !selectedAudit) return;

    setIsGenerating(true);
    setProgress(30);

    setTimeout(() => {
      setProgress(100);
      setAuditData(mockAuditData);
      setIsGenerating(false);
      setShowPreview(true);
      toast.success("Audit generated (preview)");
    }, 1500);
  };

  /* ===== PDF PREVIEW ===== */

  if (showPreview) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 md:p-8 border border-white/10 h-full flex flex-col">

        <div className="flex justify-between mb-4 flex-none">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button onClick={exportAuditPDF} className="btn-primary px-6 py-2">
            Download PDF
          </button>
        </div>

        <div id="audit-report-content" className="bg-muted rounded-xl p-6 flex-1 overflow-y-auto">
          {selectedAudit === "website" && <WebsiteAuditPDF />}
          {selectedAudit === "product" && <ProductAuditPDF />}
        </div>
      </div>
    );
  }

  /* ===== AUDIT TYPE SELECTION ===== */

  if (!selectedAudit) {
    return (
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto h-full items-center">
        <AuditCard
          title="Website Audit"
          desc="Performance, SEO, UX, Security analysis"
          onClick={() => setSelectedAudit("website")}
        />

        <AuditCard
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

      <div className="relative mb-6">
        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourwebsite.com"
          className="input-glass pl-12 py-4 text-lg"
        />
      </div>

      {isGenerating && (
        <div className="space-y-3 mb-6">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating audit...
          </div>
        </div>
      )}

      {!isGenerating && (
        <button onClick={handleGenerate} className="btn-primary w-full py-4 text-lg">
          <Wand2 className="w-5 h-5" />
          Generate Premium Audit
        </button>
      )}

    </div>
  );
}

/* ======================
 AUDIT CARD COMPONENT
====================== */

function AuditCard({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-black/40 backdrop-blur-xl rounded-2xl p-10 border border-white/10 text-left hover:border-primary transition shadow-xl h-64 flex flex-col justify-center"
    >
      <div className="flex items-center gap-3 mb-4">
        <Globe className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-lg">{desc}</p>
    </button>
  );
}