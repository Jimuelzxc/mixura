
'use server';
/**
 * @fileOverview An AI flow to suggest details for an image.
 *
 * - suggestDetails - A function that suggests title, notes, tags, and a board for an image.
 * - SuggestDetailsInput - The input type for the suggestDetails function.
 * - SuggestDetailsOutput - The return type for the suggestDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestDetailsInput = z.infer<typeof SuggestDetailsInputSchema>;

const SuggestDetailsOutputSchema = z.object({
  title: z.string().describe('A concise and descriptive title for the image, no more than 10 words.'),
  notes: z.string().describe("Brief, insightful notes about the image's style, mood, or potential use. Keep it to 1-2 sentences."),
  tags: z.array(z.string()).describe('An array of 3-5 relevant lowercase tags for the image.'),
  colors: z.array(z.string()).describe('An array of 1-3 dominant basic colors from the provided list.'),
});
export type SuggestDetailsOutput = z.infer<typeof SuggestDetailsOutputSchema>;

export async function suggestDetails(input: SuggestDetailsInput): Promise<SuggestDetailsOutput> {
  return suggestDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDetailsPrompt',
  input: {schema: SuggestDetailsInputSchema},
  output: {schema: SuggestDetailsOutputSchema},
  prompt: `You are an expert curator for a visual inspiration board. Your task is to analyze an image and suggest details for it.

Analyze the provided image based on its content, style, colors, and mood.

Based on your analysis:
1.  Generate a concise and descriptive title (max 10 words).
2.  Write brief, insightful notes about the image (1-2 sentences).
3.  Suggest 3-5 relevant, lowercase, single-word tags.
4.  Identify the 1-3 most dominant colors in the image. You MUST choose from the following list of basic colors, and only return the names of the colors: Red, Orange, Yellow, Green, Teal, Blue, Purple, Pink, Brown, Black, Gray, White.

The image to analyze is here:
{{media url=photoDataUri}}`,
});

const suggestDetailsFlow = ai.defineFlow(
  {
    name: 'suggestDetailsFlow',
    inputSchema: SuggestDetailsInputSchema,
    outputSchema: SuggestDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
