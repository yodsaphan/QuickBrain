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
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store";
import { User, Video, FlashcardQuestion } from "@/types";

// Import components
import VideoFeed from "@/components/Feed/VideoFeed";
import Header from "@/components/Navigation/Header";
import BottomNav from "@/components/Navigation/BottomNav";
import UserProfile from "@/components/Profile/UserProfile";
import Placeholder from "@/components/Placeholder";
import FlashcardGame from "@/components/Games/FlashcardGame";
import StreakDisplay from "@/components/Streaks/StreakDisplay";
import Login from "@/components/Auth/Login";
import AIChat from "@/components/AI/AIChat";
import VideoUpload from "@/components/Video/VideoUpload";

export default function Home() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"forYou" | "following">("forYou");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentView, setCurrentView] = useState<
    "home" | "learn" | "profile" | "search" | "login"
  >("home");
  const [showGame, setShowGame] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [gameScores, setGameScores] = useState<
    { videoId: string; score: number }[]
  >([]);
  const [user, setUserState] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Sample video data (in a real app, this would come from an API)
  const videos: Video[] = [
    {
      id: "1",
      title: "Quadratic Equations",
      url: "/videos/1.mp4",
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
      url: "/videos/2.mp4",
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

        setUserState(userData);
        dispatch(setUser(userData));
      } else {
        // User is signed out
        setUserState(null);
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // Handle video change
  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index);

    // Add to watched videos if not already watched
    const videoId = videos[index].id;
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos([...watchedVideos, videoId]);

      // Update streak if this is the first video watched today
      const today = new Date().toDateString();
      const lastWatchDate = localStorage.getItem("lastWatchDate");

      if (lastWatchDate !== today) {
        setStreakCount(streakCount + 1);
        localStorage.setItem("lastWatchDate", today);
      }
    }
  };

  // Handle tab change
  const handleTabChange = (tab: "forYou" | "following") => {
    setActiveTab(tab);
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
    setGameScores([...gameScores, { videoId, score }]);

    // Update streak
    setStreakCount(streakCount + 1);

    // Close game
    setShowGame(false);
  };

  // Handle login
  const handleLogin = (userData: User) => {
    setUserState(userData);
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

  // Render the current view
  const renderView = () => {
    switch (currentView) {
      case "home":
        return (
          <>
            <Header
              activeTab={activeTab}
              onTabChange={handleTabChange}
              user={user}
            />
            <VideoFeed
              videos={videos}
              currentIndex={currentVideoIndex}
              onVideoChange={handleVideoChange}
              onGameStart={handleGameStart}
              activeTab={activeTab}
            />
            <StreakDisplay count={streakCount} />
          </>
        );
      case "learn":
        return (
          <Placeholder
            title="Learning Center"
            icon={<FaBrain size={48} />}
            onBack={() => setCurrentView("home")}
          />
        );
      case "profile":
        return user ? (
          <UserProfile
            user={user}
            watchedVideos={watchedVideos}
            gameScores={gameScores}
            onBack={() => setCurrentView("home")}
          />
        ) : (
          <Placeholder
            title="Please Login"
            icon={<FaUser size={48} />}
            onBack={() => setCurrentView("home")}
          />
        );
      case "search":
        return (
          <Placeholder
            title="Search"
            icon={<FaSearch size={48} />}
            onBack={() => setCurrentView("home")}
          />
        );
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
          videoContent={videos[currentVideoIndex]?.description || ""}
        />
      )}
      {showUpload && (
        <VideoUpload
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
      {showGame && (
        <FlashcardGame
          questions={flashcards[videos[currentVideoIndex].id] || []}
          onComplete={handleGameComplete}
          onClose={() => setShowGame(false)}
        />
      )}
    </div>
  );
}
