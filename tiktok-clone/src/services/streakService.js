import api from './api';

// Get user streak
export const getUserStreak = async () => {
  try {
    const response = await api.get('/streaks');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user streak history
export const getStreakHistory = async () => {
  try {
    const response = await api.get('/streaks/history');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get user streak milestones
export const getStreakMilestones = async () => {
  try {
    const response = await api.get('/streaks/milestones');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get leaderboard
export const getLeaderboard = async () => {
  try {
    const response = await api.get('/streaks/leaderboard');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
}; 