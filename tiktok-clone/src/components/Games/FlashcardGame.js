import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaTrophy } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardGame = ({ questions, onComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question

  const currentQuestion = questions[currentQuestionIndex];

  // Timer for each question
  useEffect(() => {
    if (selectedOption !== null || gameComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleOptionSelect(null); // Time's up, move to next question
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, selectedOption, gameComplete]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    
    // Check if answer is correct
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    // Move to next question after 2 seconds
    setTimeout(() => {
      setShowResult(false);
      setSelectedOption(null);
      setTimeLeft(15);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const handleGameComplete = () => {
    onComplete(score, questions.length);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Knowledge Check</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {!gameComplete ? (
        <>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="timer">
            <div 
              className="timer-bar" 
              style={{ 
                width: `${(timeLeft / 15) * 100}%`,
                backgroundColor: timeLeft < 5 ? '#ff4d4f' : '#1890ff'
              }}
            ></div>
            <span className="timer-text">{timeLeft}s</span>
          </div>
          
          <div className="question-container">
            <h3 className="question-text">{currentQuestion.question}</h3>
            
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`option-button ${
                    selectedOption === index 
                      ? index === currentQuestion.correctAnswer 
                        ? 'correct' 
                        : 'incorrect' 
                      : selectedOption !== null && index === currentQuestion.correctAnswer 
                        ? 'correct' 
                        : ''
                  }`}
                  onClick={() => selectedOption === null && handleOptionSelect(index)}
                  whileTap={{ scale: 0.95 }}
                  disabled={selectedOption !== null}
                >
                  {option}
                  {showResult && index === currentQuestion.correctAnswer && (
                    <span className="check-icon"><FaCheck /></span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </>
      ) : (
        <div className="game-results">
          <div className="trophy-container">
            <FaTrophy className={score === questions.length ? 'perfect-score' : ''} />
          </div>
          
          <h2>Game Complete!</h2>
          <p className="score-text">
            You scored <span className="score-value">{score}</span> out of {questions.length}
          </p>
          
          {score === questions.length && (
            <p className="perfect-message">Perfect score! You earned 2 streak points!</p>
          )}
          
          <motion.button 
            className="continue-button"
            onClick={handleGameComplete}
            whileTap={{ scale: 0.95 }}
          >
            Continue Learning
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default FlashcardGame; 