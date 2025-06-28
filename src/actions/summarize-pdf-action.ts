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
  } catch (e: any) {
    console.error('Error in summarizePdf server action:', e);
    if (e.message?.includes('503') || e.message?.includes('overloaded')) {
      throw new Error('The AI model is temporarily overloaded. Please try again in a moment.');
    }
    if (e.message?.includes('429') || e.message?.includes('quota')) {
      throw new Error('You have exceeded the free usage quota for the AI model. Please try again later.');
    }
    throw new Error(`An error occurred during summarization: ${e.message}`);
  }
}
