import axios from 'axios';

const API_URL = 'http://localhost:10000';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/hackathon/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { User } = response.data.data;
        localStorage.setItem('user', JSON.stringify(User));
        return response.data.data;
      } else {
        throw new Error(response.data.error.message);
      }
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getRole: () => {
    const user = authService.getUser();
    return user ? user.role : null;
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
};

export default authService;
