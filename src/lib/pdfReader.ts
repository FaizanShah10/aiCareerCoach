"use client";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Minimal structural type we actually need
type PdfTextItem = {
  str: string;
};

export const readPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text +=
      content.items
        .map((item) => {
          // Safe runtime narrowing
          if (typeof (item as PdfTextItem).str === "string") {
            return (item as PdfTextItem).str;
          }
          return "";
        })
        .join(" ") + "\n";
  }

  return text.trim();
};
