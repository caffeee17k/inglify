import { WordResponse } from '~/models/WordResponse';

export async function fetchWordDefinition(word: string): Promise<WordResponse[]> {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch definition for "${word}"`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching word definition:', error);
    throw error;
  }
}
