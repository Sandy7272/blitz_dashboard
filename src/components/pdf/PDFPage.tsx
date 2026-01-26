import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PDFPageProps {
  children: ReactNode;
  className?: string;
  pageNumber?: number;
  totalPages?: number;
  showFooter?: boolean;
  compact?: boolean;
}

export default function PDFPage({
  children,
  className,
  pageNumber,
  totalPages,
  showFooter = true,
  compact = false,
}: PDFPageProps) {
  return (
    <div
      className={cn(
        "pdf-page bg-white mx-auto relative box-border print:shadow-none",
        className
      )}
      style={{
        width: "210mm",
        minHeight: "297mm",
        maxWidth: "210mm",

        /* 🔥 CRITICAL for multi-page PDF */
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* Content */}
      <div
        className={cn(
          "flex flex-col",
          compact ? "px-10 pt-8 pb-6" : "px-10 pt-10 pb-6",
          showFooter ? "min-h-[calc(297mm-12mm)]" : "min-h-[297mm]"
        )}
        style={{
          paddingBottom: showFooter ? "12mm" : undefined,
        }}
      >
        <div className="flex-1">
          {children}
        </div>
      </div>

      {/* Footer */}
      {showFooter && pageNumber && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[12mm] px-10 flex items-center justify-between border-t border-border/30 text-xs text-muted-foreground bg-white"
          style={{ height: "12mm" }}
        >
          <span className="font-medium">Confidential Audit Report</span>
          <span>
            Page {pageNumber} of {totalPages || pageNumber}
          </span>
        </div>
      )}
    </div>
  );
}
