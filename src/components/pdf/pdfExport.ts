import html2pdf from "html2pdf.js";

export const exportAuditPDF = async (filename: string = "audit-report.pdf") => {
  const element = document.getElementById("audit-report-content");

  if (!element) {
    console.error("Audit content not found");
    return;
  }

  // Store original styles
  const originalClasses = element.className;
  const originalStyle = element.getAttribute("style") || "";

  // Prepare for PDF export
  element.classList.remove("space-y-6");
  element.classList.add("print:space-y-0");
  element.style.gap = "0px";

  // Wait for all elements to render (gradients, icons, fonts)
  await new Promise(resolve => setTimeout(resolve, 500));

  const opt = {
    filename,
    margin: 0,
    image: { 
      type: "jpeg" as const, 
      quality: 0.98 
    },
    html2canvas: {
      scale: 2, // High resolution
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      letterRendering: true,
      windowWidth: 794,  // A4 width in pixels at 96dpi
      windowHeight: 1123, // A4 height in pixels at 96dpi
      logging: false,
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
      compress: true,
    },
    pagebreak: {
      mode: ["css", "legacy"],
      before: ".pdf-page",
      avoid: [".no-break", ".score-card", ".issue-item"],
    },
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } catch (error) {
    console.error("PDF export failed:", error);
    throw error;
  } finally {
    // Restore original state
    element.className = originalClasses;
    element.setAttribute("style", originalStyle);
  }
};

// Alternative export for direct PDF blob (useful for uploads/previews)
export const exportAuditPDFBlob = async (): Promise<Blob> => {
  const element = document.getElementById("audit-report-content");

  if (!element) {
    throw new Error("Audit content not found");
  }

  const originalClasses = element.className;
  const originalStyle = element.getAttribute("style") || "";

  element.classList.remove("space-y-6");
  element.classList.add("print:space-y-0");
  element.style.gap = "0px";

  await new Promise(resolve => setTimeout(resolve, 500));

  const opt = {
    margin: 0,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      windowHeight: 1123,
      logging: false,
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
      compress: true,
    },
    pagebreak: {
      mode: ["css", "legacy"],
      before: ".pdf-page",
    },
  };

  try {
    const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
    return pdfBlob;
  } finally {
    element.className = originalClasses;
    element.setAttribute("style", originalStyle);
  }
};
