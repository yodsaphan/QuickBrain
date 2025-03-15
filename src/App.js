import React, { useState, useEffect } from 'react';
import './App.css';
import { FaSearch, FaGamepad, FaFire, FaUser, FaBrain, FaComment, FaQuestion } from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Import components
import VideoFeed from './components/Feed/VideoFeed';
import Header from './components/Navigation/Header';
import BottomNav from './components/Navigation/BottomNav';
import UserProfile from './components/Profile/UserProfile';
import Placeholder from './components/Placeholder';
import FlashcardGame from './components/Games/FlashcardGame';
import StreakDisplay from './components/Streaks/StreakDisplay';
import Login from './components/Auth/Login';
import AIChat from './components/AI/AIChat';

function App() {
  const [activeTab, setActiveTab] = useState('forYou');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentView, setCurrentView] = useState('home');
  const [showGame, setShowGame] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [gameScores, setGameScores] = useState([]);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  // Sample video data (in a real app, this would come from an API)
  const videos = [
    {
      id: 1,
      url: '/videos/1.mp4',
      user: {
        username: '@math_teacher',
        profilePic: '/profiles/user1.jpg'
      },
      description: 'Learn how to solve quadratic equations in 60 seconds! #math #algebra #education',
      subject: 'Mathematics',
      topic: 'Algebra',
      duration: '60s',
      likes: '123.4K',
      comments: '1,234',
      shares: '567'
    },
    // ... other videos
  ];

  // ... existing code and functions

  return (
    <div className="flex flex-col h-[932px] w-[430px] overflow-hidden relative bg-black rounded-[40px] shadow-2xl">
      {renderView()}
      <BottomNav activeView={currentView} onNavigate={handleNavigation} />
      {showLogin && <Login onLogin={handleLogin} onClose={closeLogin} />}
      {showAIChat && (
        <AIChat 
          onClose={() => setShowAIChat(false)} 
          videoContent={videos[currentVideoIndex]?.description || ''}
        />
      )}
    </div>
  );
}

export default App; 