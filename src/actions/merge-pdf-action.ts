
'use server';

import { PDFDocument } from 'pdf-lib';

type MergeResult = 
  | { success: true; data: string }
  | { success: false; error: string };

export async function mergePdfs(formData: FormData): Promise<MergeResult> {
  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) {
    return { success: false, error: 'No files uploaded.' };
  }

  let currentFileName = '';

  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      currentFileName = file.name;
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfDataUri = `data:application/pdf;base64,${Buffer.from(
      mergedPdfBytes
    ).toString('base64')}`;

    return { success: true, data: mergedPdfDataUri };
  } catch (e: any) {
    console.error(`PDF merge failed on file: ${currentFileName}`, e);
    const errorMessage = `Failed to process the file "${currentFileName}". It may be corrupted, password-protected, or an unsupported format.`;
    return { success: false, error: errorMessage };
  }
}
