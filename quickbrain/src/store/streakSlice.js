import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as streakService from '../services/streakService';

// Async thunks for streaks
export const fetchUserStreak = createAsyncThunk(
  'streaks/fetchUserStreak',
  async (_, { rejectWithValue }) => {
    try {
      const response = await streakService.getUserStreak();
      return response.streak;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user streak');
    }
  }
);

export const fetchStreakHistory = createAsyncThunk(
  'streaks/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await streakService.getStreakHistory();
      return response.history;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch streak history');
    }
  }
);

export const fetchStreakMilestones = createAsyncThunk(
  'streaks/fetchMilestones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await streakService.getStreakMilestones();
      return response.milestones;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch streak milestones');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'streaks/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await streakService.getLeaderboard();
      return response.leaderboard;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

// Streak slice
const streakSlice = createSlice({
  name: 'streaks',
  initialState: {
    currentStreak: 0,
    longestStreak: 0,
    lastActive: null,
    history: [],
    milestones: [],
    leaderboard: [],
    loading: false,
    error: null
  },
  reducers: {
    clearStreakError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user streak cases
      .addCase(fetchUserStreak.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStreak.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStreak = action.payload.currentStreak;
        state.longestStreak = action.payload.longestStreak;
        state.lastActive = action.payload.lastActive;
      })
      .addCase(fetchUserStreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch streak history cases
      .addCase(fetchStreakHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStreakHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchStreakHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch streak milestones cases
      .addCase(fetchStreakMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStreakMilestones.fulfilled, (state, action) => {
        state.loading = false;
        state.milestones = action.payload;
      })
      .addCase(fetchStreakMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch leaderboard cases
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStreakError } = streakSlice.actions;
export default streakSlice.reducer; 