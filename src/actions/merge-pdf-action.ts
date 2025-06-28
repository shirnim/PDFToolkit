'use server';

import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(formData: FormData): Promise<string> {
  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) {
    throw new Error('No files uploaded.');
  }

  const mergedPdf = await PDFDocument.create();
  let currentFileName = '';

  try {
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

    return mergedPdfDataUri;
  } catch (e: any) {
    console.error(`PDF merge failed on file: ${currentFileName}`, e);
    const errorMessage = `Failed to process the file "${currentFileName}". It may be corrupted, password-protected, or an unsupported format.`;
    throw new Error(errorMessage);
  }
}
