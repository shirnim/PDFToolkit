'use server';

/**
 * @fileOverview Genkit flow for PDF summarization.
 *
 * - summarizePdfFlow - A Genkit flow that summarizes a PDF.
 * - SummarizePdfInput - The input type for the flow.
 * - SummarizePdfOutput - The return type for the flow.
 */

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
    const { output } = await prompt(input);
    if (!output?.summary) {
        throw new Error('The AI model returned an empty or invalid summary. The document might be incompatible or unreadable.');
    }
    return output;
  }
);
