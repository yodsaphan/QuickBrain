import { Message } from '@/types';

interface Flashcard {
  question: {
    en: string;
    th: string;
  };
  answer: {
    en: string;
    th: string;
  };
}

const CHUTES_API_URL = 'https://llm.chutes.ai/v1/chat/completions';

const generateFlashcardPrompt = (topic: string, count: number = 5): string => {
  return `Generate ${count} unique educational flashcards about ${topic}.
Each flashcard should have a clear question and a concise answer.
Focus on different aspects and subtopics of ${topic}.
Avoid repeating similar questions or concepts.

For each flashcard:
1. First write the question and answer in English
2. Then translate both the question and answer to Thai
3. Format as a JSON object with both English and Thai versions

Return ONLY a JSON array of objects with the following structure:
{
  "question": {
    "en": "English question",
    "th": "คำถามภาษาไทย"
  },
  "answer": {
    "en": "English answer",
    "th": "คำตอบภาษาไทย"
  }
}

Keep answers concise and clear. Do not include any thinking process, explanations, or other text.`;
};

export const generateFlashcards = async (topic: string, count: number = 5): Promise<Flashcard[]> => {
  if (!process.env.NEXT_PUBLIC_CHUTES_API_KEY) {
    throw new Error('Chutes API key is not configured');
  }

  try {
    const response = await fetch(CHUTES_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHUTES_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-R1',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful educational assistant and translator. Generate unique and diverse questions about the given topic, and provide accurate Thai translations. Keep responses concise and clear. Return ONLY the JSON array of flashcards, no other text or thinking process.'
          },
          {
            role: 'user',
            content: generateFlashcardPrompt(topic, count)
          }
        ],
        stream: false,
        max_tokens: 2048,  // Increased token limit
        temperature: 0.9
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: CHUTES_API_URL
      });
      
      throw new Error(`API request failed: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    try {
      // Clean the response content to ensure it's valid JSON
      const content = data.choices[0].message.content.trim();
      
      // Extract JSON array from the response
      const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      
      const jsonStr = jsonMatch[0];
      // Ensure the JSON is complete by checking for balanced brackets
      const openBrackets = (jsonStr.match(/\{/g) || []).length;
      const closeBrackets = (jsonStr.match(/\}/g) || []).length;
      
      if (openBrackets !== closeBrackets) {
        throw new Error('Incomplete JSON response');
      }
      
      const flashcards = JSON.parse(jsonStr);
      if (!Array.isArray(flashcards)) {
        throw new Error('Invalid flashcard format: not an array');
      }
      
      // Validate each flashcard has the required fields
      const validFlashcards = flashcards.filter(card => 
        typeof card === 'object' && 
        typeof card.question === 'object' && 
        typeof card.answer === 'object' &&
        typeof card.question.en === 'string' && 
        typeof card.question.th === 'string' && 
        typeof card.answer.en === 'string' && 
        typeof card.answer.th === 'string'
      );

      if (validFlashcards.length === 0) {
        throw new Error('No valid flashcards found in response');
      }

      return validFlashcards;
    } catch (parseError) {
      console.error('Error parsing flashcard response:', parseError);
      console.error('Raw response:', data.choices[0].message.content);
      throw new Error('Failed to parse flashcard response');
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}; 