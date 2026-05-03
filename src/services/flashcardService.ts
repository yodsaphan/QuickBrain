import { Message } from '@/types';
import { sendMessageToAI, checkGeminiApiKey } from './aiService';

interface Flashcard {
  english: {
    question: string;
    answer: string;
  };
  thai: {
    question: string;
    answer: string;
  };
}

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
  "english": {
    "question": "English question",
    "answer": "English answer"
  },
  "thai": {
    "question": "คำถามภาษาไทย",
    "answer": "คำตอบภาษาไทย"
  }
}

Keep answers concise and clear. Do not include any thinking process, explanations, or other text.`;
};

export const generateFlashcards = async (topic: string, count: number = 5): Promise<Flashcard[]> => {
  await checkGeminiApiKey();

  try {
    const messages: Message[] = [
      {
        role: 'user',
        content: generateFlashcardPrompt(topic, count)
      }
    ];
    const aiResponse = await sendMessageToAI(messages);

    const data = aiResponse ? JSON.parse(aiResponse) : null;
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from API');
    }
  
    try {
      // Clean the response content to ensure it's valid JSON
      const content = data.candidates[0].content.parts[0].text.trim();
      
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
        typeof card.english === 'object' && 
        typeof card.thai === 'object' &&
        typeof card.english.question === 'string' && 
        typeof card.thai.question === 'string' && 
        typeof card.english.answer === 'string' && 
        typeof card.thai.answer === 'string'
      );

      if (validFlashcards.length === 0) {
        throw new Error('No valid flashcards found in response');
      }

      return validFlashcards;
    } catch (parseError) {
      console.error('Error parsing flashcard response:', parseError);
      console.error('Error, Raw response:', data.candidates[0].content.parts[0].text);
      throw new Error('Failed to parse flashcard response');
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}; 