import axios from "axios";
import env from "../config/env";
import { useQuery } from "@tanstack/react-query";

// Core validation function
const validateTokenRequest = async () => {
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
};

// Hook for using token validation with React Query
export const useTokenValidation = (options = {}) => {
  return useQuery({
    queryKey: ['tokenValidation'],
    queryFn: validateTokenRequest,
    staleTime: 5 * 60 * 1000, // Consider result fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes 
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    ...options
  });
};

const tokenService = {
  validateToken: validateTokenRequest
};

export default tokenService;