import React from 'react';
import { FaArrowLeft, FaFire, FaTrophy, FaVideo, FaGamepad, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StreakDisplay = ({ streakCount, watchedVideos, gameScores, onBack }) => {
  // Determine streak color based on count
  const getStreakColor = () => {
    if (streakCount >= 50) return 'rainbow'; // Rainbow fire (animated)
    if (streakCount >= 30) return 'blue';    // Blue fire
    if (streakCount >= 20) return 'purple';  // Purple fire
    if (streakCount >= 10) return 'green';   // Green fire
    if (streakCount >= 5) return 'orange';   // Orange fire
    return 'red';                           // Red fire (default)
  };

  // Calculate stats
  const perfectGames = gameScores.filter(game => game.score === game.totalQuestions).length;
  const totalVideosWatched = watchedVideos.length;
  const averageScore = gameScores.length > 0 
    ? Math.round((gameScores.reduce((acc, game) => acc + (game.score / game.totalQuestions), 0) / gameScores.length) * 100) 
    : 0;

  return (
    <div className="streak-container">
      <div className="streak-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Your Learning Streak</h2>
      </div>

      <div className="streak-display">
        <motion.div 
          className={`streak-icon ${getStreakColor()}`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaFire />
          {streakCount >= 50 && (
            <motion.div 
              className="streak-particles"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.div>
        <h1 className="streak-count">{streakCount}</h1>
        <p className="streak-label">Current Streak</p>
      </div>

      <div className="streak-info">
        <p>
          Keep learning to increase your streak! Watch videos and complete knowledge checks to earn streak points.
        </p>
      </div>

      <div className="streak-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaVideo />
          </div>
          <div className="stat-value">{totalVideosWatched}</div>
          <div className="stat-label">Videos Watched</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaGamepad />
          </div>
          <div className="stat-value">{gameScores.length}</div>
          <div className="stat-label">Games Played</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-value">{perfectGames}</div>
          <div className="stat-label">Perfect Scores</div>
        </div>
      </div>

      <div className="streak-progress">
        <h3>Streak Progress</h3>
        <div className="progress-track">
          <div className="progress-milestones">
            <div className={`milestone ${streakCount >= 5 ? 'achieved' : ''}`}>
              <div className="milestone-icon red">
                <FaFire />
              </div>
              <span>5</span>
            </div>
            <div className={`milestone ${streakCount >= 10 ? 'achieved' : ''}`}>
              <div className="milestone-icon orange">
                <FaFire />
              </div>
              <span>10</span>
            </div>
            <div className={`milestone ${streakCount >= 20 ? 'achieved' : ''}`}>
              <div className="milestone-icon green">
                <FaFire />
              </div>
              <span>20</span>
            </div>
            <div className={`milestone ${streakCount >= 30 ? 'achieved' : ''}`}>
              <div className="milestone-icon purple">
                <FaFire />
              </div>
              <span>30</span>
            </div>
            <div className={`milestone ${streakCount >= 50 ? 'achieved' : ''}`}>
              <div className="milestone-icon blue">
                <FaFire />
              </div>
              <span>50</span>
            </div>
          </div>
          <div className="progress-line">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min(streakCount / 50 * 100, 100)}%`,
                background: streakCount >= 50 
                  ? 'linear-gradient(to right, #ff4d4f, #ff7a45, #ffc53d, #73d13d, #40a9ff, #9254de)' 
                  : ''
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="streak-tips">
        <h3>How to Earn Streaks</h3>
        <ul>
          <li>+1 point for each video watched completely</li>
          <li>+2 points for each perfect score on knowledge checks</li>
          <li>Unlock new streak colors as you progress!</li>
        </ul>
      </div>
    </div>
  );
};

export default StreakDisplay; 