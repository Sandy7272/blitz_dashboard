import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { 
  Link as LinkIcon,
  Wand2,
  Loader2,
  Globe,
  ChevronLeft
} from "lucide-react";
import { CreationWizard } from "@/components/workspace/CreationWizard";
import { api } from "@/lib/api";
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
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <p className="text-sm text-primary font-medium mb-1">
            {workflow.subtitle}
          </p>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {workflow.title}
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            {workflow.description}
          </p>
        </motion.div>

        {isAudit ? <AuditFlow /> : <ImageFlow workflow={workflow} type={type} />}

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

  /* -------- MOCK DATA FOR NOW (FRONTEND ONLY) -------- */

  const mockAuditData = {
    siteName: "Example Store",
    score: 78,
    seo: 72,
    performance: 81,
    ux: 75,
    security: 85,
    issues: [
      "Slow page load speed",
      "Missing meta descriptions",
      "Low image optimization"
    ],
  };

  /* -------- TEMP GENERATE (NO AI) -------- */

  const handleGenerate = () => {
    if (!url.trim() || !selectedAudit) return;

    setIsGenerating(true);
    setProgress(20);

    setTimeout(() => {
      setProgress(100);

      setAuditData(mockAuditData); // 👉 Mock JSON injected

      setIsGenerating(false);
      setShowPreview(true);

      toast.success("Audit complete (mock preview)");
    }, 1500);
  };

  /* ================= PDF PREVIEW ================= */

  if (showPreview) {
    return (
      <div className="bg-muted py-8 rounded-xl">

        <div className="max-w-5xl mx-auto px-4">

          <div className="flex items-center justify-between mb-8">

            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={exportAuditPDF}
              className="btn-primary px-6 py-3"
            >
              Download PDF
            </button>

          </div>

          <div id="audit-report-content">

            {selectedAudit === "website" && (
              <WebsiteAuditPDF data={auditData} />
            )}

            {selectedAudit === "product" && (
              <ProductAuditPDF data={auditData} />
            )}

          </div>

        </div>
      </div>
    );
  }

  /* ================= AUDIT TYPE SELECTION ================= */

  if (!selectedAudit) {
    return (
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

        <button
          onClick={() => setSelectedAudit("website")}
          className="glass-card p-8 text-left hover:border-primary transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Website Audit</h3>
          </div>
          <p className="text-muted-foreground">
            Performance, SEO, UX, Security analysis
          </p>
        </button>

        <button
          onClick={() => setSelectedAudit("product")}
          className="glass-card p-8 text-left hover:border-primary transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">Product Page Audit</h3>
          </div>
          <p className="text-muted-foreground">
            Conversion & trust optimization
          </p>
        </button>

      </div>
    );
  }

  /* ================= URL INPUT ================= */

  return (
    <div className="max-w-2xl mx-auto glass-card p-8">

      <div className="relative mb-6">
        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourwebsite.com"
          className="input-glass pl-12 py-4"
        />
      </div>

      {isGenerating && (
        <div className="space-y-3 mb-6">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating audit preview...
          </div>
        </div>
      )}

      {!isGenerating && (
        <button
          onClick={handleGenerate}
          className="btn-primary w-full py-4"
        >
          <Wand2 className="w-5 h-5" />
          Generate Audit Preview
        </button>
      )}

    </div>
  );
}

/* ======================
 IMAGE FLOW (UNCHANGED)
====================== */

function ImageFlow({
  workflow,
  type,
}: {
  workflow: any;
  type: "apparel" | "food";
}) {
  return (
    <CreationWizard
      workflowType={type}
      backendMode={workflow.backendMode}
    />
  );
}
