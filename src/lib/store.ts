'use client';

import { configureStore } from '@reduxjs/toolkit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Video, User, Flashcard, Streak } from '@/types';

// Video slice
interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  error: string | null;
}

const initialVideoState: VideoState = {
  videos: [],
  currentVideo: null,
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
  loading: boolean;
  error: string | null;
}

const initialFlashcardState: FlashcardState = {
  flashcards: {},
  loading: false,
  error: null
};

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState: initialFlashcardState,
  reducers: {
    setFlashcards: (state, action: PayloadAction<{ videoId: string; questions: FlashcardQuestion[] }>) => {
      state.flashcards[action.payload.videoId] = action.payload.questions;
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
    addStreakHistory: (state, action: PayloadAction<StreakHistory>) => {
      state.history.push(action.payload);
    }
  }
});

// UI slice
interface UIState {
  activeTab: 'forYou' | 'following';
  showComments: boolean;
  showShare: boolean;
  showLogin: boolean;
  showRegister: boolean;
  showCreateVideo: boolean;
  showCreateFlashcard: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialUIState: UIState = {
  activeTab: 'forYou',
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
    setActiveTab: (state, action: PayloadAction<'forYou' | 'following'>) => {
      state.activeTab = action.payload;
    },
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

export const { 
  setActiveTab, 
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
export const { setVideos, setCurrentVideo } = videoSlice.actions;
export const { setFlashcards } = flashcardSlice.actions;
export const { setStreakCount, addStreakHistory } = streakSlice.actions;

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