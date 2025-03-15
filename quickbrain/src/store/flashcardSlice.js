import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as flashcardService from '../services/flashcardService';

// Async thunks for flashcards
export const fetchFlashcardsByVideo = createAsyncThunk(
  'flashcards/fetchByVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await flashcardService.getFlashcardsByVideo(videoId);
      return response.flashcards;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch flashcards');
    }
  }
);

export const createFlashcards = createAsyncThunk(
  'flashcards/create',
  async (flashcardData, { rejectWithValue }) => {
    try {
      const response = await flashcardService.createFlashcards(flashcardData);
      return response.flashcards;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create flashcards');
    }
  }
);

export const updateFlashcards = createAsyncThunk(
  'flashcards/update',
  async ({ flashcardId, questions }, { rejectWithValue }) => {
    try {
      const response = await flashcardService.updateFlashcards(flashcardId, questions);
      return response.flashcards;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update flashcards');
    }
  }
);

export const deleteFlashcards = createAsyncThunk(
  'flashcards/delete',
  async (flashcardId, { rejectWithValue }) => {
    try {
      await flashcardService.deleteFlashcards(flashcardId);
      return flashcardId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete flashcards');
    }
  }
);

export const submitGameResults = createAsyncThunk(
  'flashcards/submitGame',
  async (gameData, { rejectWithValue }) => {
    try {
      const response = await flashcardService.submitGameResults(gameData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit game results');
    }
  }
);

export const fetchUserGames = createAsyncThunk(
  'flashcards/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await flashcardService.getUserGames();
      return response.games;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user games');
    }
  }
);

// Flashcard slice
const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState: {
    items: [],
    currentFlashcards: null,
    games: [],
    currentGame: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentFlashcards: (state, action) => {
      state.currentFlashcards = action.payload;
    },
    startGame: (state, action) => {
      state.currentGame = {
        flashcardId: action.payload.flashcardId,
        videoId: action.payload.videoId,
        startTime: new Date().toISOString(),
        score: 0,
        totalQuestions: action.payload.totalQuestions,
        answers: []
      };
    },
    updateGameAnswer: (state, action) => {
      if (state.currentGame) {
        state.currentGame.answers.push(action.payload);
        if (action.payload.isCorrect) {
          state.currentGame.score += 1;
        }
      }
    },
    clearFlashcardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch flashcards by video cases
      .addCase(fetchFlashcardsByVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashcardsByVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlashcards = action.payload;
      })
      .addCase(fetchFlashcardsByVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create flashcards cases
      .addCase(createFlashcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlashcards.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.currentFlashcards = action.payload;
      })
      .addCase(createFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update flashcards cases
      .addCase(updateFlashcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlashcards.fulfilled, (state, action) => {
        state.loading = false;
        // Update in items array
        const index = state.items.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Update current flashcards if it's the same one
        if (state.currentFlashcards && state.currentFlashcards.id === action.payload.id) {
          state.currentFlashcards = action.payload;
        }
      })
      .addCase(updateFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete flashcards cases
      .addCase(deleteFlashcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlashcards.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(f => f.id !== action.payload);
        if (state.currentFlashcards && state.currentFlashcards.id === action.payload) {
          state.currentFlashcards = null;
        }
      })
      .addCase(deleteFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit game results cases
      .addCase(submitGameResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitGameResults.fulfilled, (state, action) => {
        state.loading = false;
        state.games.unshift(action.payload.game);
        state.currentGame = null;
      })
      .addCase(submitGameResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user games cases
      .addCase(fetchUserGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchUserGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setCurrentFlashcards, 
  startGame, 
  updateGameAnswer, 
  clearFlashcardError 
} = flashcardSlice.actions;

export default flashcardSlice.reducer; 