'use server';

import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function splitPdf(
  formData: FormData
): Promise<{ data?: string; error?: string }> {
  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file uploaded.' };
  }

  try {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount <= 1) {
      return { error: 'PDF has only one page, no splitting needed.' };
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

    return { data: zipDataUri };
  } catch (e: any) {
    console.error('PDF split failed:', e);
    return {
      error:
        e.message ||
        'Failed to split PDF. The file might be corrupted or password-protected.',
    };
  }
}
