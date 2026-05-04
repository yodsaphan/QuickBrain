import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcards } from '@/services/flashcardService';
import { sendMessageToAI, checkGeminiApiKey } from '@/services/aiService';

export async function POST(request: NextRequest) {
  
  try {
    const body = await request.json();
    const mode = body.mode;

    await checkGeminiApiKey();

    if (mode === 'chat') {
      const messages = body.messages;
      if (!Array.isArray(messages)) {
        return NextResponse.json({ error: 'messages is required for chat mode' }, { status: 400 });
      }

      const response = await sendMessageToAI(messages);
      return NextResponse.json({ response });
    }

    if (mode === 'flashcards') {
      const topic = body.topic;
      const count = typeof body.count === 'number' ? body.count : 5;
      if (!topic || typeof topic !== 'string') {
        return NextResponse.json({ error: 'topic is required for flashcards mode' }, { status: 400 });
      }

      const flashcards = await generateFlashcards(topic, count);
      return NextResponse.json({ flashcards });
    }

    return NextResponse.json({ error: 'Invalid AI request mode' }, { status: 400 });
  } catch (error) {
    console.error('AI route error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'AI request failed',
      },
      { status: 500 }
    );
  }
}
