'use server';

import {
  summarizePdfFlow,
  type SummarizePdfInput,
  type SummarizePdfOutput,
} from '@/ai/flows/summarize-pdf';

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
    return result;
  } catch (e: any)
  {
    console.error('Error in summarizePdf server action:', e);
    // Re-throw the error to be caught by the client-side caller
    throw new Error(`An error occurred during summarization: ${e.message}`);
  }
}
