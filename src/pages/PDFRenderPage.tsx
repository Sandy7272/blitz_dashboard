import { ProductAuditPDF } from "@/components/pdf/ProductAuditPDF";
import { productAuditMockData } from "@/mock/productAuditMock";

export default function PDFRenderPage() {
  return (
    <div style={{ background: "white", padding: "20px" }}>
      <ProductAuditPDF data={productAuditMockData} />
    </div>
  );
}
