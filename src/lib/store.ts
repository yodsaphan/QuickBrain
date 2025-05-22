'use client';

import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Video, User, FlashcardQuestion, StreakHistory } from '@/types';

// Video slice
interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  currentVideoIndex: number;
  watchedVideos: string[];
  loading: boolean;
  error: string | null;
}

const initialVideoState: VideoState = {
  videos: [],
  currentVideo: null,
  currentVideoIndex: 0,
  watchedVideos: [],
  loading: false,
  error: null
};

const videoSlice = createSlice({
  name: 'videos',
  initialState: initialVideoState,
  reducers: {
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
    },
    setCurrentVideo: (state, action: PayloadAction<Video>) => {
      state.currentVideo = action.payload;
    },
    setCurrentVideoIndex: (state, action: PayloadAction<number>) => {
      state.currentVideoIndex = action.payload;
    },
    addWatchedVideo: (state, action: PayloadAction<string>) => {
      if (!state.watchedVideos.includes(action.payload)) {
        state.watchedVideos.push(action.payload);
      }
    }
  }
});

// Auth slice
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// Flashcard slice
interface FlashcardState {
  flashcards: Record<string, FlashcardQuestion[]>;
  gameScores: { videoId: string; score: number }[];
  loading: boolean;
  error: string | null;
}

const initialFlashcardState: FlashcardState = {
  flashcards: {},
  gameScores: [],
  loading: false,
  error: null
};

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState: initialFlashcardState,
  reducers: {
    setFlashcards: (state, action: PayloadAction<{ videoId: string; questions: FlashcardQuestion[] }>) => {
      state.flashcards[action.payload.videoId] = action.payload.questions;
    },
    addGameScore: (state, action: PayloadAction<{ videoId: string; score: number }>) => {
      state.gameScores.push(action.payload);
    }
  }
});

// Streak slice
interface StreakState {
  streakCount: number;
  history: StreakHistory[];
  loading: boolean;
  error: string | null;
}

const initialStreakState: StreakState = {
  streakCount: 0,
  history: [],
  loading: false,
  error: null
};

const streakSlice = createSlice({
  name: 'streaks',
  initialState: initialStreakState,
  reducers: {
    setStreakCount: (state, action: PayloadAction<number>) => {
      state.streakCount = action.payload;
    },
    incrementStreak: (state) => {
      state.streakCount += 1;
    },
    resetStreak: (state) => {
      state.streakCount = 0;
    },
    addStreakHistory: (state, action: PayloadAction<StreakHistory>) => {
      state.history.push(action.payload);
    }
  }
});

// UI slice
interface UIState {
  showComments: boolean;
  showShare: boolean;
  showLogin: boolean;
  showRegister: boolean;
  showCreateVideo: boolean;
  showCreateFlashcard: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialUIState: UIState = {
  showComments: false,
  showShare: false,
  showLogin: false,
  showRegister: false,
  showCreateVideo: false,
  showCreateFlashcard: false,
  notification: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    toggleComments: (state) => {
      state.showComments = !state.showComments;
    },
    toggleShare: (state) => {
      state.showShare = !state.showShare;
    },
    toggleLogin: (state, action: PayloadAction<boolean | undefined>) => {
      state.showLogin = action.payload !== undefined ? action.payload : !state.showLogin;
      if (state.showLogin) state.showRegister = false;
    },
    toggleRegister: (state, action: PayloadAction<boolean | undefined>) => {
      state.showRegister = action.payload !== undefined ? action.payload : !state.showRegister;
      if (state.showRegister) state.showLogin = false;
    },
    toggleCreateVideo: (state, action: PayloadAction<boolean | undefined>) => {
      state.showCreateVideo = action.payload !== undefined ? action.payload : !state.showCreateVideo;
    },
    toggleCreateFlashcard: (state, action: PayloadAction<boolean | undefined>) => {
      state.showCreateFlashcard = action.payload !== undefined ? action.payload : !state.showCreateFlashcard;
    },
    setNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' } | null>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

// Export all actions
export const { 
  toggleComments, 
  toggleShare,
  toggleLogin,
  toggleRegister,
  toggleCreateVideo,
  toggleCreateFlashcard,
  setNotification,
  clearNotification
} = uiSlice.actions;

export const { setUser, setLoading, setError } = authSlice.actions;
export const { 
  setVideos, 
  setCurrentVideo, 
  setCurrentVideoIndex,
  addWatchedVideo 
} = videoSlice.actions;
export const { setFlashcards, addGameScore } = flashcardSlice.actions;
export const { 
  setStreakCount, 
  incrementStreak, 
  resetStreak,
  addStreakHistory 
} = streakSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    videos: videoSlice.reducer,
    auth: authSlice.reducer,
    flashcards: flashcardSlice.reducer,
    streaks: streakSlice.reducer,
    ui: uiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 