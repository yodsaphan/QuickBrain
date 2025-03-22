import React from 'react';
import { FaArrowLeft, FaVideo, FaGamepad, FaTrophy } from 'react-icons/fa';
import { User } from '@/types';

interface UserProfileProps {
  user: User;
  watchedVideos: string[];
  gameScores: {videoId: string, score: number}[];
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, watchedVideos, gameScores, onBack }) => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>Profile</h2>
      </div>
      
      <div className="profile-content">
        <div className="user-info">
          <img 
            src={user.profilePic || '/default-profile.jpg'} 
            alt={user.username} 
            className="profile-avatar"
          />
          <h3 className="profile-username">{user.username}</h3>
          <p className="profile-bio">{user.bio || 'No bio yet'}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-count">{watchedVideos.length}</span>
              <span className="stat-label">Watched</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">{gameScores.length}</span>
              <span className="stat-label">Quizzes</span>
            </div>
            <div className="stat-item">
              <span className="stat-count">
                {gameScores.reduce((total, current) => total + current.score, 0)}
              </span>
              <span className="stat-label">Points</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h4 className="section-title">
            <FaVideo />
            Recently Watched
          </h4>
          <div className="video-grid">
            {watchedVideos.length > 0 ? (
              <p>You've watched {watchedVideos.length} videos</p>
            ) : (
              <p>No videos watched yet</p>
            )}
          </div>
        </div>
        
        <div className="profile-section">
          <h4 className="section-title">
            <FaGamepad />
            Quiz Results
          </h4>
          <div className="quiz-results">
            {gameScores.length > 0 ? (
              <p>You've completed {gameScores.length} quizzes</p>
            ) : (
              <p>No quizzes completed yet</p>
            )}
          </div>
        </div>
        
        <div className="profile-section">
          <h4 className="section-title">
            <FaTrophy />
            Achievements
          </h4>
          <div className="achievement-list">
            <div className="achievement-item">
              <div className="achievement-icon">
                <FaTrophy />
              </div>
              <div className="achievement-info">
                <div className="achievement-title">First Video</div>
                <div className="achievement-desc">Watched your first video</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 