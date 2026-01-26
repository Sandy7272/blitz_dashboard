import { cn } from "@/lib/utils";
import { ScoreCircle } from "../ui/ScoreCircle";

interface PDFCoverPageProps {
  title: string;
  subtitle: string;
  websiteName: string;
  date: string;
  overallScore: number;
  reportType: "website" | "product";
}

// A4 dimensions: 210mm x 297mm
// Cover page uses full bleed with gradient header

export default function PDFCoverPage({
  title,
  subtitle,
  websiteName,
  date,
  overallScore,
  reportType,
}: PDFCoverPageProps) {
  return (
    <div 
      className="pdf-page bg-white w-[210mm] h-[297mm] mx-auto relative overflow-hidden shadow-premium print:shadow-none box-border"
      style={{
        width: "210mm",
        height: "297mm",
        minWidth: "210mm",
        maxWidth: "210mm",
        minHeight: "297mm",
        maxHeight: "297mm",
      }}
    >
      {/* Background gradient section - 55% */}
      <div className="gradient-cover relative" style={{ height: "55%" }}>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="absolute top-8 left-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-white/90 font-semibold text-lg">AuditPro</span>
        </div>

        {/* Title */}
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">
            {reportType === "website" ? "Website Audit Report" : "Product Page Audit Report"}
          </p>
          <h1 className="text-white text-3xl font-bold leading-tight mb-3">
            {title}
          </h1>
          <p className="text-white/80 text-base">{subtitle}</p>
        </div>
      </div>

      {/* Bottom section */}
      <div
        className="bg-white px-10 pt-10 pb-8 flex flex-col justify-between"
        style={{ height: "45%" }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-5 flex-1 pr-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {reportType === "website" ? "Website Analyzed" : "Product Page"}
              </p>
              <p className="text-lg font-semibold text-foreground truncate">
                {websiteName}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Report Generated</p>
              <p className="text-base font-medium text-foreground">{date}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              {reportType === "website" ? "Overall Health Score" : "Conversion Readiness"}
            </p>
            <ScoreCircle score={overallScore} size="xl" showPercentage />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            © 2024 AuditPro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Confidential Document</p>
        </div>
      </div>
    </div>
  );
}
