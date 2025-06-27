'use server';
/**
 * @fileOverview Server action for merging PDF documents.
 *
 * - mergePdfs - A server action that merges multiple PDFs into one.
 */
import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(
  formData: FormData
): Promise<{ data?: string; error?: string }> {
  const files = formData.getAll('files') as File[];
  if (!files || files.length === 0) {
    return { error: 'No files uploaded.' };
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
        throw new Error(`The file "${file.name}" could not be processed. It might be corrupted, password-protected, or an unsupported format.`);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedPdfDataUri = `data:application/pdf;base64,${Buffer.from(
      mergedPdfBytes
    ).toString('base64')}`;

    return { data: mergedPdfDataUri };
  } catch (e: any) {
    console.error('PDF merge failed:', e);
    return { error: e.message || 'An unexpected error occurred while merging the PDFs.' };
  }
}
