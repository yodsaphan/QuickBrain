import { Comment } from '@/types';

// Get comments for a video
export const getVideoComments = async (videoId: string): Promise<{ comments: Comment[] }> => {
  try {
    const response = await fetch(`/api/comments?videoId=${videoId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get comments');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Add a comment to a video
export const addComment = async (videoId: string, text: string): Promise<{ success: boolean; comment: Comment }> => {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videoId, text })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Like a comment
export const likeComment = async (commentId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to like comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string, videoId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`/api/comments/${commentId}?videoId=${videoId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}; 