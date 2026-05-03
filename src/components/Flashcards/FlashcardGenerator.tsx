"use client";

import { useState, useEffect, useRef } from "react";
import { FaRobot, FaLanguage, FaArrowLeft } from "react-icons/fa";
import Cookies from 'js-cookie';

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

interface FlashcardGeneratorProps {
  topic: string;
  onClose?: () => void;
}

const FlashcardGenerator = ({ topic, onClose }: FlashcardGeneratorProps) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean[]>([]);
  const [language, setLanguage] = useState<'en' | 'th'>('th');
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLastCard, setIsLastCard] = useState(false);
  const [viewedCardsCount, setViewedCardsCount] = useState(0);

  const fetchFlashcards = async (topic: string, count: number = 5) => {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode: 'flashcards', topic, count }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.error || 'Failed to generate flashcards');
    }

    const data = await response.json();
    return data.flashcards as Flashcard[];
  };

  // Load flashcards from cookies or generate new ones
  const loadFlashcards = async (forceNew: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const cookieKey = `flashcards_${topic}`;
      
      // Only try to get from cookies if we're not forcing a new set
      if (!forceNew) {
        const savedFlashcards = Cookies.get(cookieKey);
        if (savedFlashcards) {
          const parsedFlashcards = JSON.parse(savedFlashcards);
          setFlashcards(parsedFlashcards);
          setShowAnswers(new Array(parsedFlashcards.length).fill(false));
          setCurrentIndex(0);
          setIsLastCard(false);
          setViewedCardsCount(0);
          setLoading(false);
          return;
        }
      }

      // Generate new flashcards
      const newFlashcards = await fetchFlashcards(topic);
      setFlashcards(newFlashcards);
      setShowAnswers(new Array(newFlashcards.length).fill(false));
      setCurrentIndex(0);
      setIsLastCard(false);
      setViewedCardsCount(0);

      // Save to cookies
      Cookies.set(cookieKey, JSON.stringify(newFlashcards), { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  // Load flashcards only when topic changes
  useEffect(() => {
    loadFlashcards();
  }, [topic]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / cardHeight);

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setIsLastCard(newIndex === flashcards.length - 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, flashcards.length]);

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => {
      const newShowAnswers = [...prev];
      newShowAnswers[index] = !newShowAnswers[index];
      
      // Count viewed cards
      const viewedCount = newShowAnswers.filter(shown => shown).length;
      setViewedCardsCount(viewedCount);
      
      return newShowAnswers;
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'th' : 'en');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => loadFlashcards(true)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {/* Header - Fixed at top */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FaArrowLeft />
              <span>{language === 'th' ? 'กลับ' : 'Back'}</span>
            </button>
          )}
          <h2 className="text-xl font-semibold">
            {language === 'th' ? 'แบบฝึกหัด' : 'Flashcards'}
          </h2>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FaLanguage />
          <span>{language === 'th' ? 'English' : 'ไทย'}</span>
        </button>
      </div>

      {/* Flashcards Container - Full viewport height */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ 
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
          height: '100vh'
        }}
      >
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="h-screen flex items-center justify-center"
            style={{ 
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always'
            }}
          >
            <div 
              className="w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg p-8 cursor-pointer transition-all hover:shadow-xl"
              onClick={() => toggleAnswer(index)}
            >
              <div className="space-y-6">
                {/* Question */}
                <div>
                  <h3 className="text-3xl font-medium mb-6">
                    {language === 'th' ? card.thai.question : card.english.question}
                  </h3>
                  {showAnswers[index] && (
                    <div className="mt-8 p-8 bg-gray-50 rounded-lg">
                      <p className="text-2xl text-gray-700">
                        {language === 'th' ? card.thai.answer : card.english.answer}
                      </p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="text-sm text-gray-500 text-center">
                  {showAnswers[index] 
                    ? (language === 'th' ? 'คลิกเพื่อซ่อนคำตอบ' : 'Click to hide answer')
                    : (language === 'th' ? 'คลิกเพื่อดูคำตอบ' : 'Click to show answer')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardGenerator; 