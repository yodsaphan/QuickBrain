import api from './api';

// Get all videos (paginated)
export const getVideos = async (page = 1, limit = 10, subject = null) => {
  try {
    const params = { page, limit };
    if (subject) params.subject = subject;
    
    const response = await api.get('/videos', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get video by ID
export const getVideoById = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Create a new video
export const createVideo = async (videoData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append video file
    formData.append('video', videoData.videoFile);
    
    // Append thumbnail if provided
    if (videoData.thumbnailFile) {
      formData.append('thumbnail', videoData.thumbnailFile);
    }
    
    // Append other data
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('subject', videoData.subject);
    formData.append('topic', videoData.topic);
    formData.append('duration', videoData.duration);
    
    if (videoData.tags) {
      formData.append('tags', videoData.tags);
    }
    
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update video
export const updateVideo = async (videoId, updateData) => {
  try {
    const response = await api.put(`/videos/${videoId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Delete video
export const deleteVideo = async (videoId) => {
  try {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Mark video as watched
export const markVideoWatched = async (videoId) => {
  try {
    const response = await api.post(`/videos/${videoId}/watch`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 