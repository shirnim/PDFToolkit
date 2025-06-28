'use server';

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

type SplitResult = 
  | { success: true; data: string }
  | { success: false; error: string };


export async function splitPdf(formData: FormData): Promise<SplitResult> {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file uploaded.' };
  }

  try {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount <= 1) {
      return { success: false, error: 'PDF has only one page, so it cannot be split.' };
    }

    const zip = new JSZip();
    const pageIndices = pdfDoc.getPageIndices();

    for (let i = 0; i < pageCount; i++) {
      const pageIndex = pageIndices[i];
      const subDoc = await PDFDocument.create();
      const [copiedPage] = await subDoc.copyPages(pdfDoc, [pageIndex]);
      subDoc.addPage(copiedPage);
      const newPdfBytes = await subDoc.save();
      zip.file(`page_${i + 1}.pdf`, newPdfBytes);
    }

    const zipBytes = await zip.generateAsync({ type: 'nodebuffer' });
    const zipDataUri = `data:application/zip;base64,${Buffer.from(
      zipBytes
    ).toString('base64')}`;

    return { success: true, data: zipDataUri };
  } catch (e: any) {
    console.error(`PDF split failed for file: ${file.name}`, e);
    const errorMessage = `Failed to split the PDF "${file.name}". The file may be corrupted, password-protected, or in an unsupported format.`;
    return { success: false, error: errorMessage };
  }
}
