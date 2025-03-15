import OpenAI from 'openai';

// Initialize OpenAI client
// In production, you should store this key in environment variables
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'your-api-key-here',
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from your backend
});

// Function to send a message to OpenAI and get a response
export const sendMessageToAI = async (message, conversationHistory = []) => {
  try {
    // Format the conversation history for OpenAI
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant for an educational platform. Provide concise, accurate answers to questions about educational topics. Keep responses under 150 words when possible.' },
      ...conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI response. Please try again later.');
  }
};

// Function to generate a summary of educational content
export const generateContentSummary = async (content) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are an educational assistant that creates concise summaries of educational content.' 
        },
        { 
          role: 'user', 
          content: `Please summarize the following educational content in 3-5 bullet points:\n\n${content}` 
        }
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again later.');
  }
};

// Function to generate quiz questions based on content
export const generateQuizQuestions = async (content, numberOfQuestions = 3) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are an educational assistant that creates multiple-choice quiz questions.' 
        },
        { 
          role: 'user', 
          content: `Based on the following educational content, generate ${numberOfQuestions} multiple-choice questions with 4 options each and indicate the correct answer. Format as JSON array:\n\n${content}` 
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    // Parse the JSON response
    const jsonResponse = JSON.parse(response.choices[0].message.content);
    return jsonResponse.questions || [];
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions. Please try again later.');
  }
}; 