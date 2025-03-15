import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as videoService from '../services/videoService';

// Async thunks for videos
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async ({ page = 1, limit = 10, subject = null }, { rejectWithValue }) => {
    try {
      const response = await videoService.getVideos(page, limit, subject);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch videos');
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoService.getVideoById(videoId);
      return response.video;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch video');
    }
  }
);

export const createVideo = createAsyncThunk(
  'videos/createVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const response = await videoService.createVideo(videoData);
      return response.video;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create video');
    }
  }
);

export const markVideoWatched = createAsyncThunk(
  'videos/markWatched',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoService.markVideoWatched(videoId);
      return { videoId, data: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark video as watched');
    }
  }
);

// Video slice
const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    items: [],
    currentVideo: null,
    currentIndex: 0,
    watchedVideos: [],
    likedVideos: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      totalPages: 1,
      totalVideos: 0
    }
  },
  reducers: {
    setCurrentVideo: (state, action) => {
      state.currentIndex = action.payload;
      state.currentVideo = state.items[action.payload] || null;
    },
    likeVideo: (state, action) => {
      const videoId = action.payload;
      if (!state.likedVideos.includes(videoId)) {
        state.likedVideos.push(videoId);
      }
    },
    unlikeVideo: (state, action) => {
      const videoId = action.payload;
      state.likedVideos = state.likedVideos.filter(id => id !== videoId);
    },
    clearVideoError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch videos cases
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.videos;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          totalVideos: action.payload.totalVideos
        };
        // Set current video if none is selected
        if (!state.currentVideo && state.items.length > 0) {
          state.currentVideo = state.items[0];
        }
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch video by ID cases
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
        // Find index of this video in items array
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.currentIndex = index;
        }
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create video cases
      .addCase(createVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // Add to beginning of array
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark video watched cases
      .addCase(markVideoWatched.fulfilled, (state, action) => {
        const { videoId } = action.payload;
        if (!state.watchedVideos.includes(videoId)) {
          state.watchedVideos.push(videoId);
        }
      });
  }
});

export const { 
  setCurrentVideo, 
  likeVideo, 
  unlikeVideo, 
  clearVideoError 
} = videoSlice.actions;

export default videoSlice.reducer; 