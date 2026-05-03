import { Video } from '@/types';
import { isValidConfig } from '@/lib/firebase';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Get videos for feed
export const getFeedVideos = async (page = 1, limit = 10): Promise<{ videos: Video[] }> => {
  try {
    if (!isValidConfig) {
      // Return mock data for development
      console.log('Returning mock videos for development');
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

export const videoService = {
  async uploadVideo(
    file: File,
    metadata: {
      title: string;
      description: string;
      subject: string;
      topic: string;
      userId: string;
    }
  ): Promise<Video> {
    try {
      // 1. Upload video file to Firebase Storage
      const videoRef = ref(storage, `videos/${metadata.userId}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(videoRef, file, {
        contentType: file.type,
        customMetadata: {
          title: metadata.title,
          description: metadata.description,
          subject: metadata.subject,
          topic: metadata.topic,
        }
      });

      // 2. Get the download URL
      const videoUrl = await getDownloadURL(uploadResult.ref);

      // 3. Create video document in Firestore
      const videoData: Omit<Video, 'id'> = {
        title: metadata.title,
        url: videoUrl,
        description: metadata.description,
        user: {
          id: metadata.userId,
          username: '', // Will be populated from user data
          profilePic: '', // Will be populated from user data
        },
        subject: metadata.subject,
        topic: metadata.topic,
        duration: '60s', // You can get this from the video file
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        isPublished: true,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'videos'), videoData);

      return {
        id: docRef.id,
        ...videoData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  async generateThumbnail(videoFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      video.onloadeddata = () => {
        video.currentTime = 1; // Capture at 1 second
      };

      video.onseeked = () => {
        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          resolve(thumbnailUrl);
        }
      };

      video.onerror = () => {
        reject(new Error('Error generating thumbnail'));
      };

      video.src = URL.createObjectURL(videoFile);
    });
  },

  async uploadThumbnail(thumbnailFile: File, userId: string): Promise<string> {
    try {
      const thumbnailRef = ref(storage, `thumbnails/${userId}/${Date.now()}_${thumbnailFile.name}`);
      const uploadResult = await uploadBytes(thumbnailRef, thumbnailFile, {
        contentType: thumbnailFile.type,
      });
      return await getDownloadURL(uploadResult.ref);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
  },

  validateVideoFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('video/')) {
      return { isValid: false, error: 'Please select a valid video file' };
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'Video file is too large (max 100MB)' };
    }

    return { isValid: true };
  },

  validateThumbnailFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Please select a valid image file' };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'Thumbnail file is too large (max 5MB)' };
    }

    return { isValid: true };
  }
}; 