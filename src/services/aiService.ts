import { Message } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

export async function checkGeminiApiKey(): Promise<void> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
}

export async function sendMessageToAI(messages: Message[]): Promise<string> {
  try {
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': `${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [
          {
            parts: messages.map(msg => ({
              text: msg.content
            }))
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Error from Gemini API: ${response.statusText}`);
    }
    
    const data = await response.json();
    /*const data = {
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "[\n  {\n    \"english\": {\n      \"question\": \"What is a variable in algebra?\",\n      \"answer\": \"A symbol, usually a letter, used to represent an unknown or changing number.\"\n    },\n    \"thai\": {\n      \"question\": \"ตัวแปรในพีชคณิตคืออะไร?\",\n      \"answer\": \"สัญลักษณ์ที่มักใช้เป็นตัวอักษร เพื่อแทนจำนวนที่ไม่ทราบค่าหรือมีการเปลี่ยนแปลง\"\n    }\n  },\n  {\n    \"english\": {\n      \"question\": \"What is the goal when solving a linear equation for a single variable?\",\n      \"answer\": \"To isolate the variable on one side of the equation.\"\n    },\n    \"thai\": {\n      \"question\": \"เป้าหมายในการแก้สมการเชิงเส้นสำหรับตัวแปรเดียวคืออะไร?\",\n      \"answer\": \"เพื่อแยกตัวแปรให้อยู่เพียงด้านเดียวของสมการ\"\n    }\n  },\n  {\n    \"english\": {\n      \"question\": \"What does the 'Vertical Line Test' determine about a graph?\",\n      \"answer\": \"Whether the relationship shown on the graph is a function.\"\n    },\n    \"thai\": {\n      \"question\": \"การทดสอบเส้นแนวตั้ง (Vertical Line Test) ใช้ตรวจสอบอะไรเกี่ยวกับกราฟ?\",\n      \"answer\": \"ตรวจสอบว่าความสัมพันธ์ที่แสดงบนกราฟเป็นฟังก์ชันหรือไม่\"\n    }\n  },\n  {\n    \"english\": {\n      \"question\": \"What is the result of any non-zero number raised to the power of zero?\",\n      \"answer\": \"The result is always 1.\"\n    },\n    \"thai\": {\n      \"question\": \"ผลลัพธ์ของจำนวนใดๆ ที่ไม่ใช่ศูนย์ยกกำลังศูนย์คืออะไร?\",\n      \"answer\": \"ผลลัพธ์จะเป็น 1 เสมอ\"\n    }\n  },\n  {\n    \"english\": {\n      \"question\": \"In the quadratic formula, what is the term b² - 4ac called?\",\n      \"answer\": \"The discriminant.\"\n    },\n    \"thai\": {\n      \"question\": \"ในสูตรกำลังสอง พจน์ b² - 4ac เรียกว่าอะไร?\",\n      \"answer\": \"ดีสคริมิแนนต์ (Discriminant)\"\n    }\n  }\n]",
            "thoughtSignature": "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"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 114,
    "candidatesTokenCount": 511,
    "totalTokenCount": 1728,
    "promptTokensDetails": [
      {
        "modality": "TEXT",
        "tokenCount": 114
      }
    ],
    "thoughtsTokenCount": 1103
  },
  "modelVersion": "gemini-3-flash-preview",
  "responseId": "f0r3acOQMcvJjuMP3rrS8Ak"
}*/
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, I am having trouble generating a response right now.';
  }
}