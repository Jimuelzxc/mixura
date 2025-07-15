'use server';
/**
 * @fileOverview An AI flow to suggest notes for an image.
 *
 * - suggestNotes - A function that suggests notes for an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNotesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
type SuggestNotesInput = z.infer<typeof SuggestNotesInputSchema>;

const SuggestNotesOutputSchema = z.object({
  notes: z.string().describe("Brief, insightful notes about the image's style, mood, or potential use. Keep it to 1-2 sentences."),
  usage: z.object({
    inputTokens: z.number(),
    outputTokens: z.number(),
    totalTokens: z.number(),
  }).optional(),
  error: z.string().optional(),
});
type SuggestNotesOutput = z.infer<typeof SuggestNotesOutputSchema>;

export async function suggestNotes(input: SuggestNotesInput): Promise<SuggestNotesOutput> {
  return suggestNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNotesPrompt',
  input: {schema: SuggestNotesInputSchema},
  output: {schema: SuggestNotesOutputSchema.omit({ error: true })},
  prompt: `You are an expert curator for a visual inspiration board. Your task is to analyze an image and suggest notes for it.

Analyze the provided image based on its content, style, colors, and mood.

Based on your analysis, write brief, insightful notes about the image (1-2 sentences).

The image to analyze is here:
{{media url=photoDataUri}}`,
});

const suggestNotesFlow = ai.defineFlow(
  {
    name: 'suggestNotesFlow',
    inputSchema: SuggestNotesInputSchema,
    outputSchema: SuggestNotesOutputSchema,
  },
  async input => {
    try {
      const {output, usage} = await prompt(input);
      return {
        ...output!,
        usage,
      };
    } catch (error: any) {
      console.error("AI note suggestion failed:", error);
      return {
        notes: '',
        error: `The AI service is temporarily unavailable. Please try again later.`
      };
    }
  }
);
