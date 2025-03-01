import api from './api';

// Get flashcards for a video
export const getFlashcardsByVideo = async (videoId) => {
  try {
    const response = await api.get(`/flashcards/video/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Create flashcards for a video
export const createFlashcards = async (flashcardData) => {
  try {
    const response = await api.post('/flashcards', flashcardData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update flashcards
export const updateFlashcards = async (flashcardId, questions) => {
  try {
    const response = await api.put(`/flashcards/${flashcardId}`, { questions });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Delete flashcards
export const deleteFlashcards = async (flashcardId) => {
  try {
    const response = await api.delete(`/flashcards/${flashcardId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Submit flashcard game results
export const submitGameResults = async (gameData) => {
  try {
    const response = await api.post('/flashcards/game', gameData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user game history
export const getUserGames = async () => {
  try {
    const response = await api.get('/flashcards/games');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 