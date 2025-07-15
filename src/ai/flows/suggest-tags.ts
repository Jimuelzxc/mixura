'use server';
/**
 * @fileOverview An AI flow to suggest tags for an image.
 *
 * - suggestTags - A function that suggests tags for an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of 3-5 relevant lowercase, single-word tags for the image.'),
  usage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
});
type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an expert curator for a visual inspiration board. Your task is to analyze an image and suggest tags for it.

Analyze the provided image based on its content, style, colors, and mood.

Based on your analysis, suggest 3-5 relevant, lowercase, single-word tags.

The image to analyze is here:
{{media url=photoDataUri}}`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    try {
      const {output, usage} = await prompt(input);
      return {
        ...output!,
        usage,
      };
    } catch (error: any) {
      console.error("AI tag suggestion failed:", error);
      throw new Error(`The AI service is temporarily unavailable. Please try again later.`);
    }
  }
);
