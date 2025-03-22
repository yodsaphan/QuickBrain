// User types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  createdAt: Date;
  lastActive?: Date;
}

// Video types
export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  user: {
    id: string;
    username: string;
    profilePic?: string;
  };
  subject?: string;
  topic?: string;
  duration?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  tags?: string[];
  isPublished: boolean;
  createdAt: Date;
}

// Flashcard types
export interface FlashcardQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Flashcard {
  id: string;
  videoId: string;
  questions: FlashcardQuestion[];
  createdAt: Date;
}

// Comment types
export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  userProfilePic?: string;
  text: string;
  likes: number;
  createdAt: Date;
}

// Streak types
export interface StreakHistory {
  date: Date;
  points: number;
  source: 'video' | 'game' | 'other';
}

export interface Streak {
  id: string;
  userId: string;
  count: number;
  lastUpdated: Date;
  history: StreakHistory[];
  milestones: {
    level: number;
    achieved: boolean;
    achievedAt?: Date;
  }[];
} 