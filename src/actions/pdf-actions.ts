'use server';

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function mergePdfsAction(
  formData: FormData
): Promise<{ data?: string; error?: string }> {
  try {
    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
      return { error: 'No files uploaded.' };
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
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

    return { data: mergedPdfDataUri };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to merge PDFs. The file might be corrupted or password-protected.' };
  }
}
