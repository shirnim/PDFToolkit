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

    if (!result?.comparison) {
      throw new Error(
        'The AI model returned an empty or invalid comparison. The documents might be incompatible or unreadable.'
      );
    }

    return result;
  } catch (e: any) {
    console.error('Error in comparePdfs server action:', e);
    throw new Error(`An error occurred during comparison: ${e.message}`);
  }
}
