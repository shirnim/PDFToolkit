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
  } catch (e) {
    console.error(e);
    return { error: 'Failed to merge PDFs. The file might be corrupted or password-protected.' };
  }
}


export async function splitPdfAction(
  formData: FormData
): Promise<{ data?: string; error?: string }> {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { error: 'No file uploaded.' };
        }

        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();
        
        if (pageCount <= 1) {
            return { error: 'PDF has only one page, no splitting needed.'}
        }

        const zip = new JSZip();

        for (let i = 0; i < pageCount; i++) {
            const subDoc = await PDFDocument.create();
            const [copiedPage] = await subDoc.copyPages(pdfDoc, [i]);
            subDoc.addPage(copiedPage);
            const pdfBytes = await subDoc.save();
            zip.file(`page_${i + 1}.pdf`, pdfBytes);
        }

        const zipBytes = await zip.generateAsync({ type: 'nodebuffer' });
        const zipDataUri = `data:application/zip;base64,${zipBytes.toString('base64')}`;
        
        return { data: zipDataUri };

    } catch(e) {
        console.error(e);
        return { error: 'Failed to split PDF. The file might be corrupted or password-protected.' };
    }
}
