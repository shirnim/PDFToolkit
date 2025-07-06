'use server';

import {
  comparePdfsFlow,
  type ComparePdfsInput,
  type ComparePdfsOutput,
} from '@/ai/flows/compare-pdfs';

export async function comparePdfs(
  input: ComparePdfsInput
): Promise<ComparePdfsOutput> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error(
        'The GOOGLE_API_KEY is not set. Please add it to your .env file.'
      );
    }
    const result = await comparePdfsFlow(input);
    return result;
  } catch (e: any) {
    console.error('Error in comparePdfs server action:', e);
    if (e.message?.includes('503') || e.message?.includes('overloaded')) {
      throw new Error('The AI model is temporarily overloaded. Please try again in a moment.');
    }
    if (e.message?.includes('429') || e.message?.includes('quota')) {
      throw new Error('You have exceeded the free usage quota for the AI model. Please try again later.');
    }
    throw new Error(`An error occurred during comparison: ${e.message}`);
  }
}
