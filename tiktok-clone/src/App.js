import React, { useState, useEffect } from 'react';
import './App.css';
import { FaSearch, FaGamepad, FaFire, FaUser, FaBrain, FaComment, FaQuestion, FaRobot } from 'react-icons/fa';
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
    {
      id: 2,
      url: '/videos/2.mp4',
      user: {
        username: '@science_expert',
        profilePic: '/profiles/user2.jpg'
      },
      description: 'The water cycle explained simply! #science #nature #education',
      subject: 'Science',
      topic: 'Earth Science',
      duration: '45s',
      likes: '456.7K',
      comments: '3,456',
      shares: '789'
    },
    {
      id: 3,
      url: '/videos/3.mp4',
      user: {
        username: '@history_buff',
        profilePic: '/profiles/user3.jpg'
      },
      description: 'Quick facts about Ancient Egypt you might not know! #history #education #facts',
      subject: 'History',
      topic: 'Ancient Civilizations',
      duration: '50s',
      likes: '89.2K',
      comments: '2,145',
      shares: '432'
    },
    {
      id: 4,
      url: '/videos/4.mp4',
      user: {
        username: '@language_arts',
        profilePic: '/profiles/user4.jpg'
      },
      description: 'Three tips to improve your essay writing! #writing #education #tips',
      subject: 'English',
      topic: 'Writing',
      duration: '55s',
      likes: '67.8K',
      comments: '1,987',
      shares: '345'
    }
  ];

  // Sample flashcard questions for each video
  const flashcards = {
    1: [
      {
        question: "What is the formula for solving a quadratic equation?",
        options: ["x = (-b ± √(b² - 4ac)) / 2a", "x = a² + b² + c²", "x = (a + b) / c", "x = a + b + c"],
        correctAnswer: 0
      },
      {
        question: "In a quadratic equation ax² + bx + c = 0, what does 'b' represent?",
        options: ["The y-intercept", "The coefficient of x", "The coefficient of x²", "The constant term"],
        correctAnswer: 1
      },
      {
        question: "What is the discriminant in a quadratic equation?",
        options: ["a", "b", "c", "b² - 4ac"],
        correctAnswer: 3
      }
    ],
    2: [
      {
        question: "What drives the water cycle?",
        options: ["Wind", "Sun's energy", "Gravity", "Moon's pull"],
        correctAnswer: 1
      },
      {
        question: "What is the process called when water vapor turns into liquid?",
        options: ["Evaporation", "Transpiration", "Condensation", "Precipitation"],
        correctAnswer: 2
      },
      {
        question: "Which of these is NOT part of the water cycle?",
        options: ["Evaporation", "Condensation", "Precipitation", "Photosynthesis"],
        correctAnswer: 3
      }
    ],
    3: [
      {
        question: "What was the main purpose of pyramids in Ancient Egypt?",
        options: ["Grain storage", "Tombs for pharaohs", "Astronomical observatories", "Government buildings"],
        correctAnswer: 1
      },
      {
        question: "Which river was essential to Ancient Egyptian civilization?",
        options: ["Tigris", "Euphrates", "Nile", "Amazon"],
        correctAnswer: 2
      },
      {
        question: "What writing system did Ancient Egyptians use?",
        options: ["Cuneiform", "Hieroglyphics", "Alphabet", "Runes"],
        correctAnswer: 1
      }
    ],
    4: [
      {
        question: "What is typically included in an essay introduction?",
        options: ["Detailed evidence", "Thesis statement", "Conclusion", "Bibliography"],
        correctAnswer: 1
      },
      {
        question: "What is the purpose of a topic sentence?",
        options: ["To conclude an essay", "To introduce the main idea of a paragraph", "To cite sources", "To transition between essays"],
        correctAnswer: 1
      },
      {
        question: "Which of these is NOT typically part of the essay writing process?",
        options: ["Drafting", "Revising", "Publishing", "Memorizing"],
        correctAnswer: 3
      }
    ]
  };

  // Check if user has watched 3 videos to trigger game
  useEffect(() => {
    if (watchedVideos.length >= 3 && !watchedVideos.includes(currentVideoIndex) && !showGame) {
      setShowGame(true);
    }
  }, [currentVideoIndex, watchedVideos, showGame]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser({
          _id: user.uid,
          username: user.displayName || `user_${user.uid.substring(0, 5)}`,
          email: user.email,
          profilePic: user.photoURL || '/profiles/default.jpg'
        });
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleNavigation = (view) => {
    if (view === 'flashcards') {
      setShowGame(true);
    } else if (view === 'profile' && !user) {
      setShowLogin(true);
    } else {
      setCurrentView(view);
      setShowGame(false);
    }
  };

  const handleVideoComplete = (videoId) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos([...watchedVideos, videoId]);
      updateStreak(1);
    }
  };

  const handleGameComplete = (score, totalQuestions) => {
    setGameScores([...gameScores, { score, totalQuestions }]);
    setShowGame(false);
    
    if (score === totalQuestions) {
      updateStreak(2); // Perfect score gives 2 streak points
    }
  };

  const updateStreak = (points) => {
    setStreakCount(streakCount + points);
  };

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setCurrentView('profile');
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // Close login modal
  const closeLogin = () => {
    setShowLogin(false);
  };

  // Render the appropriate view based on currentView state
  const renderView = () => {
    // If game should be shown, show it regardless of current view
    if (showGame) {
      return (
        <FlashcardGame 
          questions={flashcards[currentVideoIndex + 1] || flashcards[1]} 
          onComplete={handleGameComplete}
          onClose={() => setShowGame(false)}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <>
            <Header activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="content">
              <VideoFeed 
                videos={videos} 
                currentIndex={currentVideoIndex} 
                onVideoChange={handleVideoChange}
                onVideoComplete={handleVideoComplete}
                onAIChat={() => setShowAIChat(true)}
              />
            </main>
          </>
        );
      case 'profile':
        return <UserProfile user={user} onLogout={handleLogout} />;
      case 'discover':
        return (
          <Placeholder 
            title="Discover Learning Content" 
            icon={<FaSearch />} 
            onBack={() => handleNavigation('home')} 
          />
        );
      case 'streaks':
        return (
          <StreakDisplay 
            streakCount={streakCount}
            watchedVideos={watchedVideos}
            gameScores={gameScores}
            onBack={() => handleNavigation('home')}
          />
        );
      case 'login':
        return <Login onLogin={handleLogin} onClose={closeLogin} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
      <BottomNav activeView={currentView} onNavigate={handleNavigation} />
      {showLogin && <Login onLogin={handleLogin} onClose={closeLogin} />}
      {showAIChat && (
        <AIChat 
          onClose={() => setShowAIChat(false)} 
          videoContent={videos[currentVideoIndex]?.description || ''}
        />
      )}
      <button 
        className="ai-chat-button" 
        onClick={() => setShowAIChat(true)}
      >
        <FaRobot />
        <span>AI Chat</span>
      </button>
    </div>
  );
}

export default App;
