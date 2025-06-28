'use server';

import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(formData: FormData): Promise<string> {
  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) {
    throw new Error('No files uploaded.');
  }

  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (innerError: any) {
        console.error(`Failed to process file: ${file.name}`, innerError);
        // Re-throwing a more user-friendly error to be caught by the outer catch block.
        throw new Error(
          `The file "${file.name}" could not be processed. It might be corrupted, password-protected, or an unsupported format.`
        );
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfDataUri = `data:application/pdf;base64,${Buffer.from(
      mergedPdfBytes
    ).toString('base64')}`;

    return mergedPdfDataUri;
  } catch (e: any) {
    console.error('PDF merge failed:', e);
    // Re-throw the error to be handled by the client
    throw new Error(
      e.message || 'An unexpected error occurred while merging the PDFs.'
    );
  }
}
