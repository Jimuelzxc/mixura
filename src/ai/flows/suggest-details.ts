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
import type { Board } from '@/lib/types';

export const SuggestDetailsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  boards: z.array(z.object({
    id: z.string(),
    name: z.string()
  })).describe('A list of existing boards to choose from.'),
});
export type SuggestDetailsInput = z.infer<typeof SuggestDetailsInputSchema>;

export const SuggestDetailsOutputSchema = z.object({
  title: z.string().describe('A concise and descriptive title for the image, no more than 10 words.'),
  notes: z.string().describe("Brief, insightful notes about the image's style, mood, or potential use. Keep it to 1-2 sentences."),
  tags: z.array(z.string()).describe('An array of 3-5 relevant lowercase tags for the image.'),
  suggestedBoardId: z.string().optional().describe('The ID of an existing board if the image fits well into one.'),
  suggestedNewBoardName: z.string().optional().describe('A new board name if the image does not fit into any existing boards.'),
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
4.  Review the list of existing boards: {{{json boards}}}.
    - If the image's theme closely matches an existing board, provide its 'id' in the 'suggestedBoardId' field.
    - If no existing boards are a good fit, suggest a short, descriptive name for a new board in the 'suggestedNewBoardName' field.
    - Only provide one or the other: 'suggestedBoardId' or 'suggestedNewBoardName', never both.

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
