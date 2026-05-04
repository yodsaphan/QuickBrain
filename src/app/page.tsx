"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaGamepad,
  FaFire,
  FaUser,
  FaBrain,
  FaComment,
  FaQuestion,
  FaRobot,
  FaPlus,
} from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isValidConfig } from "@/lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { 
  setUser, 
  setVideos, 
  setCurrentVideoIndex,
  addWatchedVideo,
  addGameScore,
  incrementStreak,
  setStreakCount,
  setFlashcards
} from "@/lib/store";
import { RootState } from "@/lib/store";
import { User, Video, FlashcardQuestion } from "@/types";

// Import components
import VideoFeed from "@/components/Feed/VideoFeed";
import BottomNav from "@/components/Navigation/BottomNav";
import UserProfile from "@/components/Profile/UserProfile";
import Placeholder from "@/components/Placeholder";
import FlashcardGame from "@/components/Games/FlashcardGame";
import StreakDisplay from "@/components/Streaks/StreakDisplay";
import Login from "@/components/Auth/Login";
import AIChat from "@/components/AI/AIChat";
import VideoUpload from "@/components/Video/VideoUpload";
import FlashcardGenerator from "@/components/Flashcards/FlashcardGenerator";

export default function Home() {
  const dispatch = useDispatch();
  const { videos, currentVideoIndex, watchedVideos } = useSelector((state: RootState) => state.videos);
  const { user } = useSelector((state: RootState) => state.auth);
  const { streakCount } = useSelector((state: RootState) => state.streaks);
  const { gameScores } = useSelector((state: RootState) => state.flashcards);

  const [currentView, setCurrentView] = useState<
    "home" | "learn" | "profile" | "search" | "login"
  >("home");
  const [showGame, setShowGame] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Sample video data (in a real app, this would come from an API)
  const sampleVideos: Video[] = [
    {
      id: "1",
      title: "Quadratic Equations",
      url: "https://stream.mux.com/rR8P8mSaKDzz02TsftugTUdI00cQPJX00oy.m3u8",
      description:
        "Learn how to solve quadratic equations in 60 seconds! #math #algebra #education",
      user: {
        id: "user1",
        username: "@math_teacher",
        profilePic: "/profiles/user1.jpg",
      },
      subject: "Mathematics",
      topic: "Algebra",
      duration: "60s",
      likes: 123400,
      comments: 1234,
      shares: 567,
      views: 500000,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Photosynthesis Explained",
      url: "/videos/1.mp4",
      description:
        "How plants convert sunlight into energy in 60 seconds! #biology #science #plants",
      user: {
        id: "user2",
        username: "@science_guru",
        profilePic: "/profiles/user2.jpg",
      },
      subject: "Biology",
      topic: "Plants",
      duration: "60s",
      likes: 98700,
      comments: 876,
      shares: 432,
      views: 420000,
      isPublished: true,
      createdAt: new Date(),
    },
  ];

  // Sample flashcards data
  const flashcards: Record<string, FlashcardQuestion[]> = {
    "1": [
      {
        question: "What is a quadratic equation?",
        options: [
          "An equation with the highest power of 2",
          "A linear equation",
          "An equation with the highest power of 3",
          "None of the above",
        ],
        correctAnswer: 0,
      },
      {
        question: "What is the quadratic formula?",
        options: [
          "x = (-b ± √(b² - 4ac)) / 2a",
          "x = -b / 2a",
          "x = -c / b",
          "x = -b / a",
        ],
        correctAnswer: 0,
      },
    ],
    "2": [
      {
        question: "What is photosynthesis?",
        options: [
          "The process by which plants make food",
          "The process by which plants reproduce",
          "The process by which plants grow",
          "The process by which plants die",
        ],
        correctAnswer: 0,
      },
      {
        question: "What do plants need for photosynthesis?",
        options: [
          "Sunlight, water, and carbon dioxide",
          "Sunlight and water only",
          "Water and carbon dioxide only",
          "Oxygen and water only",
        ],
        correctAnswer: 0,
      },
    ],
  };

  useEffect(() => {
    // Initialize videos
    dispatch(setVideos(sampleVideos));

    // Check if Firebase is properly configured
    if (!isValidConfig) {
      console.warn(
        "Firebase is not properly configured. Authentication features will not work."
      );
      return;
    }

    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData: User = {
          id: firebaseUser.uid,
          username: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          profilePic: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
        };

        dispatch(setUser(userData));
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // Handle video change
  const handleVideoChange = (index: number) => {
    dispatch(setCurrentVideoIndex(index));

    // Add to watched videos if not already watched
    const videoId = videos[index]?.id;
    if (!videoId || watchedVideos.includes(videoId)) {
      return;
    }

    dispatch(addWatchedVideo(videoId));

    // Update streak if this is the first video watched today
    const today = new Date().toDateString();
    let lastWatchDate: string | null = null;

    if (typeof window !== "undefined") {
      try {
        const storage = window.localStorage;
        if (storage && typeof storage.getItem === "function") {
          lastWatchDate = storage.getItem("lastWatchDate");
        }
      } catch (error) {
        console.warn("Unable to read lastWatchDate from localStorage:", error);
      }
    }

    if (lastWatchDate !== today) {
      dispatch(incrementStreak());

      if (typeof window !== "undefined") {
        try {
          const storage = window.localStorage;
          if (storage && typeof storage.setItem === "function") {
            storage.setItem("lastWatchDate", today);
          }
        } catch (error) {
          console.warn("Unable to write lastWatchDate to localStorage:", error);
        }
      }
    }
  };

  // Handle navigation
  const handleNavigation = (
    view: "home" | "learn" | "profile" | "search" | "login"
  ) => {
    setCurrentView(view);

    if (view === "login" && !user) {
      setShowLogin(true);
    }
  };

  // Handle game start
  const handleGameStart = () => {
    setShowGame(true);
  };

  // Handle game complete
  const handleGameComplete = (score: number) => {
    // Add game score
    const videoId = videos[currentVideoIndex].id;
    dispatch(addGameScore({ videoId, score }));

    // Update streak
    dispatch(incrementStreak());

    // Close game
    setShowGame(false);
  };

  // Handle login
  const handleLogin = (userData: User) => {
    dispatch(setUser(userData));
    setShowLogin(false);
  };

  // Close login
  const closeLogin = () => {
    setShowLogin(false);
  };

  // Handle video upload
  const handleVideoUpload = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowUpload(true);
    }
  };

  // Handle upload success
  const handleUploadSuccess = () => {
    setShowUpload(false);
    // In a real app, you would refresh the videos list here
  };

  const handleGenerateNewSet = async () => {
    try {
      dispatch(setCurrentVideoIndex(0));

      for (const video of sampleVideos) {
        const topic = video.topic || video.title;
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mode: 'flashcards', topic }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error || 'Failed to generate flashcards');
        }

        const data = await response.json();
        const flashcards = data.flashcards;

        const formattedFlashcards = flashcards.map((card: any) => ({
          question: card.question.en,
          options: [
            card.answer.en,
            "Incorrect option 1",
            "Incorrect option 2",
            "Incorrect option 3"
          ],
          correctAnswer: 0
        }));

        dispatch(setFlashcards({
          videoId: video.id,
          questions: formattedFlashcards,
        }));
      }

      dispatch(setVideos(sampleVideos));
    } catch (error) {
      console.error('Error generating new flashcard sets:', error);
    }
  };

  const handleNavigateToLearn = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentView("learn");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pb-20">
        {currentView === "home" && (
          <VideoFeed
            videos={videos}
            currentIndex={currentVideoIndex}
            onVideoChange={handleVideoChange}
            onGameStart={handleGameStart}
            onNavigateToLearn={handleNavigateToLearn}
            watchedVideos={watchedVideos}
            onGenerateNewSet={handleGenerateNewSet}
          />
        )}
        {currentView === "learn" && (
          <FlashcardGenerator 
            topic={selectedTopic || videos[currentVideoIndex]?.topic || "General Knowledge"}
            onClose={() => setCurrentView("home")}
          />
        )}
        {currentView === "profile" && user && (
          <UserProfile 
            user={user}
            watchedVideos={watchedVideos}
            gameScores={gameScores}
            onBack={() => setCurrentView("home")}
          />
        )}
        {currentView === "search" && (
          <Placeholder
            title="Search"
            icon={<FaSearch size={48} />}
            onBack={() => setCurrentView("home")}
          />
        )}
      </main>
      <BottomNav onNavigate={handleNavigation} activeView={currentView} />
      {showGame && (
        <FlashcardGame
          questions={flashcards[videos[currentVideoIndex].id] || []}
          onComplete={handleGameComplete}
          onClose={() => setShowGame(false)}
        />
      )}
      {showLogin && <Login onLogin={handleLogin} onClose={closeLogin} />}
      {showAIChat && (
        <AIChat 
          onClose={() => setShowAIChat(false)}
          videoContent={videos[currentVideoIndex]?.description || ""}
        />
      )}
      {showUpload && (
        <VideoUpload
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
