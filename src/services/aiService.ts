import { Message } from '@/types';

const CHUTES_API_URL = 'https://llm.chutes.ai/v1/chat/completions';

const filterThinkTags = (content: string): string => {
  return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
};

export const sendMessageToAI = async (messages: Message[]): Promise<string> => {
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
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: false,
        max_tokens: 1024,
        temperature: 0.7
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
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Chutes API key.');
      }
      
      if (response.status === 402) {
        throw new Error('Insufficient credits. Please check your Chutes account balance.');
      }

      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check the API documentation for the correct endpoint.');
      }
      
      throw new Error(`API request failed: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }
    return filterThinkTags(data.choices[0].message.content);
  } catch (error) {
    console.error('Error calling Chutes API:', error);
    throw error;
  }
}; 