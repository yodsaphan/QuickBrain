import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaTimes as FaX } from 'react-icons/fa';
import { FlashcardQuestion } from '@/types';

interface FlashcardGameProps {
  questions: FlashcardQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

const FlashcardGame: React.FC<FlashcardGameProps> = ({ questions, onComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [gameOver, setGameOver] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (selectedOption === null) {
            handleNextQuestion();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, selectedOption, gameOver, currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    
    setSelectedOption(optionIndex);
    
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    // Wait 1 second before moving to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(15);
    } else {
      setGameOver(true);
      setShowResult(true);
      onComplete(score + (selectedOption === currentQuestion?.correctAnswer ? 1 : 0));
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flashcard-game">
        <div className="game-header">
          <h2>Flashcard Game</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="no-questions">
          <p>No questions available for this video.</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flashcard-game">
        <div className="game-header">
          <h2>Game Results</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="game-result">
          <h3>Your Score</h3>
          <div className="score">
            {score} / {questions.length}
          </div>
          <p>
            {score === questions.length 
              ? 'Perfect! You got all questions right!' 
              : score >= questions.length / 2 
                ? 'Good job! You passed the quiz.' 
                : 'Keep learning and try again!'}
          </p>
          <button className="close-game-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-game">
      <div className="game-header">
        <div className="game-progress">
          <div className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      
      <div className="timer">
        <div 
          className="timer-bar" 
          style={{ 
            width: `${(timeLeft / 15) * 100}%`,
            backgroundColor: timeLeft < 5 ? '#ff4d4d' : '#4caf50'
          }}
        ></div>
      </div>
      
      <div className="question-container">
        <h3 className="question-text">{currentQuestion.question}</h3>
        
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button 
              key={index}
              className={`option-button ${
                selectedOption === index 
                  ? index === currentQuestion.correctAnswer 
                    ? 'correct' 
                    : 'incorrect' 
                  : ''
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
            >
              {option}
              {selectedOption === index && (
                <span className="result-icon">
                  {index === currentQuestion.correctAnswer ? <FaCheck /> : <FaX />}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashcardGame; 