import { useState } from "react";
import { FileText, Globe, ShoppingBag, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { WebsiteAuditPDF } from "@/components/pdf/WebsiteAuditPDF";
import { ProductAuditPDF } from "@/components/pdf/ProductAuditPDF";
import { websiteAuditMockData } from "@/mock/websiteAuditMock";
import { productAuditMockData } from "@/mock/productAuditMock";

type ReportType = "website" | "product" | null;

const Index = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (selectedReport) {
      setShowPreview(true);
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-muted py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 no-print">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Selection</span>
            </button>
            <button
              onClick={() => window.print()}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Download PDF
            </button>
          </div>

          {/* PDF Preview */}
          {selectedReport === "website" ? (
            <WebsiteAuditPDF data={websiteAuditMockData} />
          ) : (
            <ProductAuditPDF data={productAuditMockData} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Premium Audit Reports
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Generate Audit Report
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the type of audit report you need
          </p>
        </div>

        {/* Report Selection Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Website Audit Card */}
          <button
            onClick={() => setSelectedReport("website")}
            className={cn(
              "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
              "bg-card shadow-card hover:shadow-premium",
              selectedReport === "website"
                ? "border-accent ring-4 ring-accent/10"
                : "border-border/50 hover:border-accent/50"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                selectedReport === "website"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
              )}
            >
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Website Audit Report
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Comprehensive analysis of performance, SEO, UX, security, and conversion optimization.
            </p>
            {selectedReport === "website" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>

          {/* Product Page Audit Card */}
          <button
            onClick={() => setSelectedReport("product")}
            className={cn(
              "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
              "bg-card shadow-card hover:shadow-premium",
              selectedReport === "product"
                ? "border-accent ring-4 ring-accent/10"
                : "border-border/50 hover:border-accent/50"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                selectedReport === "product"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
              )}
            >
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Product Page Audit Report
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deep-dive into conversion readiness, content quality, trust signals, and checkout flow.
            </p>
            {selectedReport === "product" && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={!selectedReport}
            className={cn(
              "inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-300",
              selectedReport
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            <FileText className="w-5 h-5" />
            Generate PDF
            <ChevronRight className="w-5 h-5" />
          </button>
          {!selectedReport && (
            <p className="text-sm text-muted-foreground mt-3">
              Please select a report type above
            </p>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          Premium audit reports designed for agencies and SaaS tools
        </p>
      </div>
    </div>
  );
};

export default Index;
