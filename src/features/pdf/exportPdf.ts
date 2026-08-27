import { PDFDocument, rgb } from "pdf-lib";
import type { Page } from "../../types/models";

export async function exportPagePdf(page: Page): Promise<void> {
  const pdf = await PDFDocument.create();
  const sheet = pdf.addPage([page.width, page.height]);
  sheet.drawRectangle({ x: 0, y: 0, width: page.width, height: page.height, color: rgb(1, 1, 1) });
  for (const element of page.elements) {
    if (element.type === "text") {
      sheet.drawText(element.text, { x: element.x, y: page.height - element.y - element.fontSize, size: element.fontSize, color: hex(element.color) });
    }
    if (element.type === "shape" && element.shape === "rectangle") {
      sheet.drawRectangle({ x: element.x, y: page.height - element.y - element.height, width: element.width, height: element.height, borderColor: hex(element.color), borderWidth: element.strokeWidth });
    }
    if (element.type === "stroke" && element.points.length > 1) {
      for (let i = 1; i < element.points.length; i++) {
        const a = element.points[i - 1], b = element.points[i];
        sheet.drawLine({ start: { x: a.x, y: page.height - a.y }, end: { x: b.x, y: page.height - b.y }, thickness: element.width, color: hex(element.color), opacity: element.opacity });
      }
    }
  }
  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${page.title.replace(/\s+/g, "-").toLowerCase() || "inknest-page"}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function hex(value: string) {
  const clean = value.replace("#", "");
  const n = Number.parseInt(clean, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}