'use server';

/**
 * @fileOverview Genkit flow and server action for PDF summarization.
 *
 * - summarizePdf - A server action that summarizes a PDF.
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
  model: 'gemini-1.5-flash',
  prompt: `You are an expert summarizer, skilled at condensing large documents into concise summaries.

  Please summarize the following PDF document, extracting the key points and main ideas.

  PDF Document: {{media url=pdfDataUri}}`,
});

const summarizePdfFlow = ai.defineFlow(
  {
    name: 'summarizePdfFlow',
    inputSchema: SummarizePdfInputSchema,
    outputSchema: SummarizePdfOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function summarizePdf(
  input: SummarizePdfInput
): Promise<SummarizePdfOutput> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error(
        'The GOOGLE_API_KEY is not set. Please add it to your .env file.'
      );
    }

    const result = await summarizePdfFlow(input);

    if (!result?.summary) {
      throw new Error(
        'The AI model returned an empty or invalid summary. The document might be incompatible or unreadable.'
      );
    }

    return result;
  } catch (e: any) {
    console.error('Error in summarizePdf server action:', e);
    throw new Error(`An error occurred during summarization: ${e.message}`);
  }
}
