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
    throw new Error(`An error occurred during comparison: ${e.message}`);
  }
}
