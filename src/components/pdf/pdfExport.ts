import html2pdf from "html2pdf.js";

export const exportAuditPDF = async () => {
  const element = document.getElementById("audit-report-content");

  if (!element) {
    console.error("Audit content not found");
    return;
  }

  const originalClasses = element.className;  // Save from the outer element
  element.classList.remove("space-y-6");      // Remove spacing class from outer
  element.classList.add("print:space-y-0");  // Ensure print mode has no space
  element.style.gap = "0px";                  // Explicitly zero out gap

  // Add a short delay to ensure all DOM elements (gradients, icons, colors) are fully rendered
  await new Promise(resolve => setTimeout(resolve, 1000));  // 1 second delay; adjust if needed

  const opt = {
    filename: "audit-report.pdf",
    margin: 0,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      letterRendering: true,
      windowWidth: 794,  // A4 width in pixels (210mm at ~96dpi) for accurate scaling
      windowHeight: 1123, // A4 height in pixels (297mm at ~96dpi)
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
    pagebreak: {
      mode: ["css", "legacy"],
    },
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } finally {
    // Restore original state
    element.className = originalClasses;
    element.style.gap = "";
  }
};