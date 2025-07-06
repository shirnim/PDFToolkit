import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { comparePdfsFlow } from './flows/compare-pdfs';
import { mergePdfFlow } from './flows/merge-pdf';
import { splitPdfFlow } from './flows/split-pdf';
import { summarizePdfFlow } from './flows/summarize-pdf';
import cors from 'cors';

export const ai = genkit({
  plugins: [googleAI()],
  flowStateStore: 'firebase',
  telemetry: {
    instrumentation: 'firebase',
    logger: 'firebase',
  },
});

ai.addFlow(comparePdfsFlow);
ai.addFlow(mergePdfFlow);
ai.addFlow(splitPdfFlow);
ai.addFlow(summarizePdfFlow);

// Add CORS middleware
ai.use(cors({ origin: true }));

// Define endpoints for each functionality
ai.addApi('/compare', comparePdfsFlow);
ai.addApi('/merge', mergePdfFlow);
ai.addApi('/split', splitPdfFlow);
ai.addApi('/summarize', summarizePdfFlow);