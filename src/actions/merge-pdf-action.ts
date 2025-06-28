'use server';

import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(formData: FormData): Promise<string> {
  const files = formData.getAll('files') as File[];
  if (!files || files.length < 2) {
    throw new Error('Please upload at least two PDF files to merge.');
  }

  let currentFileName = '';

  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      currentFileName = file.name;

      if (file.type !== 'application/pdf') {
        throw new Error(`Invalid file type for "${file.name}". Only PDF files can be merged.`);
      }

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
    throw new Error(`Failed to process the file "${currentFileName}". It may be corrupted, password-protected, or an unsupported format.`);
  }
}
