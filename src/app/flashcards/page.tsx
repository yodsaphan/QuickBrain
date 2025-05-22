import FlashcardGenerator from '@/components/Flashcards/FlashcardGenerator';

export default function FlashcardsPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI Flashcard Generator</h1>
        <FlashcardGenerator />
      </div>
    </main>
  );
} 