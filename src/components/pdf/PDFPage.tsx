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
        "pdf-page bg-white mx-auto relative box-border print:shadow-none overflow-hidden",
        className
      )}
      style={{
        // A4 Exact Dimensions
        width: "210mm",
        height: "297mm", 
        minHeight: "297mm",
        maxHeight: "297mm",
        maxWidth: "210mm",
        
        // CSS Break Properties to prevent drift
        pageBreakAfter: "always",
        breakAfter: "page",
        pageBreakInside: "avoid",
      }}
    >
      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col h-full",
          compact ? "px-10 pt-8 pb-6" : "px-10 pt-10 pb-6"
        )}
      >
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>

      {/* Footer */}
      {showFooter && pageNumber && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[12mm] px-10 flex items-center justify-between border-t border-border/30 text-xs text-muted-foreground bg-white"
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