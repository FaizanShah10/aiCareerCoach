'use client';

import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/legacy/build/pdf';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

// Define types for pdf.js text items
interface PdfTextItem {
  str: string;
  // Add other properties if needed based on pdf.js types
  dir?: string;
  fontName?: string;
  height?: number;
  transform?: number[];
  width?: number;
}

export const readPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.filter((item) => 'str' in item).map((item) => (item as PdfTextItem).str).join(' ') + '\n';
  }

  return text.trim();
};