'use server';
/**
 * @fileOverview A PDF comparison AI agent.
 *
 * - comparePdfs - A function that handles the PDF comparison process.
 * - ComparePdfsInput - The input type for the comparePdfs function.
 * - ComparePdfsOutput - The return type for the comparePdfs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComparePdfsInputSchema = z.object({
  pdfDataUri1: z
    .string()
    .describe(
      "The first PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  pdfDataUri2: z
    .string()
    .describe(
      "The second PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ComparePdfsInput = z.infer<typeof ComparePdfsInputSchema>;

const ComparePdfsOutputSchema = z.object({
  comparison: z.string().describe('A detailed comparison of the two PDF documents, highlighting differences.'),
});
export type ComparePdfsOutput = z.infer<typeof ComparePdfsOutputSchema>;

export async function comparePdfs(input: ComparePdfsInput): Promise<ComparePdfsOutput> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('The GOOGLE_API_KEY is not set. Please add it to your .env file.');
    }
    
    const result = await comparePdfsFlow(input);
    
    if (!result?.comparison) {
      throw new Error('The AI model returned an empty or invalid comparison. The documents might be incompatible or unreadable.');
    }
    
    return result;
  } catch (e: any) {
    console.error('Error in comparePdfs server action:', e);
    throw new Error(`An error occurred during comparison: ${e.message}`);
  }
}

const prompt = ai.definePrompt({
  name: 'comparePdfsPrompt',
  input: {schema: ComparePdfsInputSchema},
  output: {schema: ComparePdfsOutputSchema},
  model: 'gemini-1.5-flash',
  prompt: `You are an expert document analyst. You are skilled at comparing documents and identifying differences.

  Please compare the two following PDF documents and provide a detailed analysis of their differences. If the documents are identical, state that.

  Document 1: {{media url=pdfDataUri1}}
  Document 2: {{media url=pdfDataUri2}}`,
});

const comparePdfsFlow = ai.defineFlow(
  {
    name: 'comparePdfsFlow',
    inputSchema: ComparePdfsInputSchema,
    outputSchema: ComparePdfsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
