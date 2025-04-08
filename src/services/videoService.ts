import { Video } from '@/types';
import { isValidConfig } from '@/lib/firebase';

// Get videos for feed
export const getFeedVideos = async (page = 1, limit = 10): Promise<{ videos: Video[] }> => {
  try {
    if (!isValidConfig) {
      // Return mock data for development
      return {
        videos: [
          {
            id: '1',
            title: 'Quadratic Equations',
            url: 'https://example.com/videos/1.mp4',
            description: 'Learn how to solve quadratic equations in 60 seconds! #math #algebra #education',
            user: {
              id: 'user1',
              username: '@math_teacher',
              profilePic: 'https://example.com/profiles/user1.jpg'
            },
            subject: 'Mathematics',
            topic: 'Algebra',
            duration: '60s',
            likes: 123400,
            comments: 1234,
            shares: 567,
            views: 500000,
            isPublished: true,
            createdAt: new Date()
          },
          {
            id: '2',
            title: 'Photosynthesis Explained',
            url: 'https://example.com/videos/2.mp4',
            description: 'How plants convert sunlight into energy in 60 seconds! #biology #science #plants',
            user: {
              id: 'user2',
              username: '@science_guru',
              profilePic: 'https://example.com/profiles/user2.jpg'
            },
            subject: 'Biology',
            topic: 'Plants',
            duration: '60s',
            likes: 98700,
            comments: 876,
            shares: 432,
            views: 420000,
            isPublished: true,
            createdAt: new Date()
          }
        ]
      };
    }
    
    const response = await fetch(`/api/videos?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get videos');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting videos:', error);
    throw error;
  }
};

// Get video by ID
export const getVideoById = async (videoId: string): Promise<{ video: Video }> => {
  try {
    if (!isValidConfig) {
      // Return mock data for development
      return {
        video: {
          id: videoId,
          title: 'Sample Video',
          url: 'https://example.com/videos/sample.mp4',
          description: 'This is a sample video for development',
          user: {
            id: 'user1',
            username: '@sample_user',
            profilePic: 'https://example.com/profiles/sample.jpg'
          },
          likes: 1000,
          comments: 100,
          shares: 50,
          views: 5000,
          isPublished: true,
          createdAt: new Date()
        }
      };
    }
    
    const response = await fetch(`/api/videos/${videoId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting video:', error);
    throw error;
  }
};

// Like a video
export const likeVideo = async (videoId: string): Promise<{ success: boolean }> => {
  try {
    if (!isValidConfig) {
      return { success: true };
    }
    
    const response = await fetch(`/api/videos/${videoId}/like`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to like video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};

// Upload a video
export const uploadVideo = async (
  videoFile: File, 
  thumbnailFile: File | null, 
  metadata: { 
    title: string; 
    description: string; 
    subject?: string; 
    topic?: string; 
  }
): Promise<{ videoId: string }> => {
  try {
    if (!isValidConfig) {
      return { videoId: 'mock-video-id' };
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('video', videoFile);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await fetch('/api/videos/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload video');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}; 