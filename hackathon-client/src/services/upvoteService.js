import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:10000';

const upvoteService = {
  upvoteQuestion: async (questionId) => {
    try {
      const user = authService.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        `${API_URL}/hackathon/questions/${questionId}/upvote`,
        { userId: user.id }
      );

      return response.data;
    } catch (error) {
      console.error('Upvote failed:', error);
      throw error;
    }
  },

  removeUpvote: async (questionId, userId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/hackathon/questions/${questionId}/upvote/${userId}`
      );

      return response.data;
    } catch (error) {
      console.error('Remove upvote failed:', error);
      throw error;
    }
  },

  getQuestionsSorted: async (chatboxId) => {
    try {
      const response = await axios.get(
        `${API_URL}/hackathon/questions/${chatboxId}`
      );

      return response.data.data || [];
    } catch (error) {
      console.error('Get sorted questions failed:', error);
      throw error;
    }
  },
  
};

export default upvoteService;
