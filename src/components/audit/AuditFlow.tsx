import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Wand2, Loader2, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

import AuditReportUI from "./AuditReportUi";
import { ExportAuditPDF } from "./pdf/pdfExport";

export default function AuditFlow() {
  const [url, setUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const pollStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await api.getJobStatus(jobId);

        if (data.status === "processing" || data.status === "processing_magic") {
          setProgress((p) => Math.min(p + 5, 90));
        }

        if (data.status === "completed") {
          clearInterval(interval);
          setProgress(100);
          setIsGenerating(false);
          setShowPreview(true);
          toast.success("Audit ready!");
        }

        if (data.status === "failed") {
          clearInterval(interval);
          setIsGenerating(false);
          toast.error("Audit failed");
        }
      } catch (e) {
        console.error(e);
      }
    }, 2500);
  };

  const startAudit = async () => {
    if (!url.trim()) return;

    setIsGenerating(true);
    setProgress(5);
    setShowPreview(false);

    try {
      const data = await api.createAuditJob(url);
      setProgress(20);
      pollStatus(data.jobId);
    } catch (e) {
      setIsGenerating(false);
      toast.error("Failed to start audit");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* INPUT CARD */}
      {!showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Website Health Check</h2>
          <p className="text-muted-foreground text-center mb-6">
            Enter your website to generate a professional audit report
          </p>

          <div className="relative mb-6">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="input-glass pl-12 py-4 text-base"
            />
          </div>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating audit... {Math.round(progress)}%
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={startAudit}
                disabled={!url.trim()}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Wand2 className="w-5 h-5" />
                Generate Audit Report
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* PDF PREVIEW */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={exportAuditPDF}
              className="btn-primary flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </button>
          </div>

          <div id="audit-report-content" className="bg-muted p-6 rounded-xl overflow-auto">
            <AuditReportUI />
          </div>
        </motion.div>
      )}

    </div>
  );
}
