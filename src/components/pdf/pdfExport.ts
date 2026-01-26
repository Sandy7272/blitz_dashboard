import html2pdf from "html2pdf.js";

export const exportAuditPDF = () => {
  const element = document.getElementById("audit-report-content");

  if (!element) {
    console.error("Audit content not found");
    return;
  }

  html2pdf()
    .from(element)
    .set({
      filename: "audit-report.pdf",

      margin: 0,

      image: {
        type: "jpeg",
        quality: 1,
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },

      pagebreak: {
        mode: ["css"],
      },
    })
    .save();
};
