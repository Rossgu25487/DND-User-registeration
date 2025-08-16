'use server';

/**
 * @fileOverview Generates a strong password for new users during registration.
 *
 * - generateStrongPassword - A function that generates a strong password.
 * - GenerateStrongPasswordInput - The input type for the generateStrongPassword function.
 * - GenerateStrongPasswordOutput - The return type for the generateStrongPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrongPasswordInputSchema = z.object({
  length: z
    .number()
    .min(8)
    .max(64)
    .default(16)
    .describe('The desired length of the password (between 8 and 64 characters).'),
  includeNumbers: z
    .boolean()
    .default(true)
    .describe('Whether to include numbers in the password.'),
  includeSymbols: z
    .boolean()
    .default(true)
    .describe('Whether to include symbols in the password.'),
});
export type GenerateStrongPasswordInput = z.infer<typeof GenerateStrongPasswordInputSchema>;

const GenerateStrongPasswordOutputSchema = z.object({
  password: z.string().describe('The generated strong password.'),
});
export type GenerateStrongPasswordOutput = z.infer<typeof GenerateStrongPasswordOutputSchema>;

export async function generateStrongPassword(
  input: GenerateStrongPasswordInput
): Promise<GenerateStrongPasswordOutput> {
  return generateStrongPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrongPasswordPrompt',
  input: {schema: GenerateStrongPasswordInputSchema},
  output: {schema: GenerateStrongPasswordOutputSchema},
  prompt: `You are a password generator. Generate a strong password based on the following criteria:

Length: {{length}} characters
Include numbers: {{#if includeNumbers}}Yes{{else}}No{{/if}}
Include symbols: {{#if includeSymbols}}Yes{{else}}No{{/if}}

The password should be random and difficult to guess.
Ensure the password meets the specified criteria.`,
});

const generateStrongPasswordFlow = ai.defineFlow(
  {
    name: 'generateStrongPasswordFlow',
    inputSchema: GenerateStrongPasswordInputSchema,
    outputSchema: GenerateStrongPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
