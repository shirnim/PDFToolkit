'use server';

/**
 * @fileOverview Genkit flow for PDF summarization.
 *
 * - summarizePdfFlow - A Genkit flow that summarizes a PDF.
 * - SummarizePdfInput - The input type for the flow.
 * - SummarizePdfOutput - The return type for the flow.
 */

import { PDFDocument } from 'pdf-lib';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizePdfInput = z.infer<typeof SummarizePdfInputSchema>;

const SummarizePdfOutputSchema = z.object({
  summary: z.string().describe('A summary of the PDF document.'),
});
export type SummarizePdfOutput = z.infer<typeof SummarizePdfOutputSchema>;

const prompt = ai.definePrompt({
  name: 'summarizePdfPrompt',
  input: {schema: SummarizePdfInputSchema},
  output: {schema: SummarizePdfOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert summarizer, skilled at condensing large documents into concise summaries.

  Please summarize the following PDF document, extracting the key points and main ideas.

  PDF Document: {{media url=pdfDataUri}}`,
});

export const summarizePdfFlow = ai.defineFlow(
  {
    name: 'summarizePdfFlow',
    inputSchema: SummarizePdfInputSchema,
    outputSchema: SummarizePdfOutputSchema,
  },
  async (input) => {
    const { pdfDataUri } = input;

    const pdfDoc = await PDFDocument.load(pdfDataUri);
    const numPages = pdfDoc.getPages().length;

    const pageSummaries: string[] = [];

    for (let i = 0; i < numPages; i++) {
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
      newPdfDoc.addPage(copiedPage);

      const singlePagePdfDataUri = await newPdfDoc.saveAsBase64({ dataUri: true });

      const { output } = await prompt({ pdfDataUri: singlePagePdfDataUri });
      if (output?.summary) {
        pageSummaries.push(output.summary);
      } else {
        // Handle cases where a page summary is empty or invalid
        console.warn(`Could not summarize page ${i + 1}`);
      }
    }

    const combinedSummary = pageSummaries.join('\\n'); // Join with newline

    return { summary: combinedSummary };
  }
);
