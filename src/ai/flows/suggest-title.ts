'use server';
/**
 * @fileOverview An AI flow to suggest a title for an image.
 *
 * - suggestTitle - A function that suggests a title for an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTitleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
type SuggestTitleInput = z.infer<typeof SuggestTitleInputSchema>;

const SuggestTitleOutputSchema = z.object({
  title: z.string().describe('A concise and descriptive title for the image, no more than 10 words.'),
  usage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
});
type SuggestTitleOutput = z.infer<typeof SuggestTitleOutputSchema>;

export async function suggestTitle(input: SuggestTitleInput): Promise<SuggestTitleOutput> {
  return suggestTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTitlePrompt',
  input: {schema: SuggestTitleInputSchema},
  output: {schema: SuggestTitleOutputSchema},
  prompt: `You are an expert curator for a visual inspiration board. Your task is to analyze an image and suggest a title for it.

Analyze the provided image based on its content, style, colors, and mood.

Based on your analysis, generate a concise and descriptive title (max 10 words).

The image to analyze is here:
{{media url=photoDataUri}}`,
});

const suggestTitleFlow = ai.defineFlow(
  {
    name: 'suggestTitleFlow',
    inputSchema: SuggestTitleInputSchema,
    outputSchema: SuggestTitleOutputSchema,
  },
  async input => {
    try {
      const {output, usage} = await prompt(input);
      return {
        ...output!,
        usage,
      };
    } catch (error: any) {
        console.error("AI title suggestion failed:", error);
        throw new Error(`The AI service is temporarily unavailable. Please try again later.`);
    }
  }
);
