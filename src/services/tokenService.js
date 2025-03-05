import axios from "axios";
import env from "../config/env";

const tokenService = {
  validateToken: async () => {
    const token = localStorage.getItem('authToken');
    
    // Skip validation if no token exists
    if (!token) {
      return { isValid: false };
    }

    try {
      const response = await axios.post(
        env.AUTH.VALIDATE_TOKEN,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return { isValid: true, data: response.data };
    } catch (error) {
      console.error('Token validation error:', error);
      return { isValid: false, error };
    }
  }
};

export default tokenService;