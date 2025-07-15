import {nextHandler} from '@genkit-ai/next';
import {googleAI} from '@genkit-ai/googleai';
import {NextRequest} from 'next/server';

export const POST = (req: NextRequest) => {
  const apiKey = req.headers.get('x-goog-api-key') || undefined;

  return nextHandler({
    plugins: [googleAI({apiKey})],
    model: 'googleai/gemini-1.5-flash-latest',
  })(req);
};
