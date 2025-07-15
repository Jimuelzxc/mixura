'use server';
/**
 * @fileOverview An AI flow to suggest colors for an image.
 *
 * - suggestColors - A function that suggests colors for an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestColorsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
type SuggestColorsInput = z.infer<typeof SuggestColorsInputSchema>;

const SuggestColorsOutputSchema = z.object({
  colors: z.array(z.string()).describe('An array of 1-3 dominant basic colors from the provided list.'),
});
type SuggestColorsOutput = z.infer<typeof SuggestColorsOutputSchema>;

export async function suggestColors(input: SuggestColorsInput): Promise<SuggestColorsOutput> {
  return suggestColorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestColorsPrompt',
  input: {schema: SuggestColorsInputSchema},
  output: {schema: SuggestColorsOutputSchema},
  prompt: `You are an expert curator for a visual inspiration board. Your task is to analyze an image and suggest colors for it.

Analyze the provided image based on its content, style, colors, and mood.

Based on your analysis, identify the 1-3 most dominant colors in the image. You MUST choose from the following list of basic colors, and only return the names of the colors: Red, Orange, Yellow, Green, Teal, Blue, Purple, Pink, Brown, Black, Gray, White.

The image to analyze is here:
{{media url=photoDataUri}}`,
});

const suggestColorsFlow = ai.defineFlow(
  {
    name: 'suggestColorsFlow',
    inputSchema: SuggestColorsInputSchema,
    outputSchema: SuggestColorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
