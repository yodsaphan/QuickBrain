"use client";

import { useSearchParams } from "next/navigation";
import FlashcardGenerator from "@/components/Flashcards/FlashcardGenerator";

export default function LearnPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "General Knowledge";

  return (
    <main className="min-h-screen bg-white">
      <FlashcardGenerator topic={topic} />
    </main>
  );
} 