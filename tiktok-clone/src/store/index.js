import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './authSlice';
import videoReducer from './videoSlice';
import flashcardReducer from './flashcardSlice';
import streakReducer from './streakSlice';
import userReducer from './userSlice';

// UI slice (kept from original store)
import { createSlice } from '@reduxjs/toolkit';

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeTab: 'forYou',
    showComments: false,
    showShare: false,
    showLogin: false,
    showRegister: false,
    showCreateVideo: false,
    showCreateFlashcard: false,
    notification: null
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleComments: (state) => {
      state.showComments = !state.showComments;
    },
    toggleShare: (state) => {
      state.showShare = !state.showShare;
    },
    toggleLogin: (state, action) => {
      state.showLogin = action.payload !== undefined ? action.payload : !state.showLogin;
      if (state.showLogin) state.showRegister = false;
    },
    toggleRegister: (state, action) => {
      state.showRegister = action.payload !== undefined ? action.payload : !state.showRegister;
      if (state.showRegister) state.showLogin = false;
    },
    toggleCreateVideo: (state, action) => {
      state.showCreateVideo = action.payload !== undefined ? action.payload : !state.showCreateVideo;
    },
    toggleCreateFlashcard: (state, action) => {
      state.showCreateFlashcard = action.payload !== undefined ? action.payload : !state.showCreateFlashcard;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

// Export UI actions
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

// Configure store
const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videoReducer,
    flashcards: flashcardReducer,
    streaks: streakReducer,
    user: userReducer,
    ui: uiSlice.reducer
  }
});

export default store; 