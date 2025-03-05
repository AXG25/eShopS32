/* eslint-disable no-useless-catch */
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import axios from "axios";
import env from "../config/env";
import tokenService from "../services/tokenService";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    user,
    permissions,
    logout: logoutStore,
    login: loginStore,
    setUser,
    setToken,
    setPermissions,
  } = useAuthStore();

  useEffect(() => {
    const validateTokenOnMount = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Set token in store first to ensure it's available for API calls
        setToken(token);
        // Then validate it
        const isValid = await validateToken();
        if (!isValid) {
          // If token is invalid, clear it from localStorage
          localStorage.removeItem('authToken');
        }
      }
    };
    validateTokenOnMount();
  }, []);
  
  // Validate token when needed
  const validateToken = async () => {
    // Only validate if we're on a protected route
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const { isValid, data } = await tokenService.validateToken();
      
      if (isValid && data) {
        // Update user data if needed
        if (data.user && (!user || user.id !== data.user.id)) {
          setUser(data.user);
          if (data.permissions) {
            setPermissions(data.permissions);
          }
        }
        return true;
      } else {
        // Token is invalid, log the user out
        logoutStore();
        return false;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      // On error, log the user out to be safe
      logoutStore();
      return false;
    }
  };

  const loginMutation = useMutation({
    mutationFn: loginStore,
    onSuccess: (data) => {
      // Store token in localStorage for persistence
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
      }
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error) => {
      console.error("Error durante el login:", error);
      // Aquí podrías manejar errores específicos, como mostrar un mensaje al usuario
    },
  });

  const login = async (credentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      const defaultRoute = (result.permissions || []).includes("admin")
        ? "/dashboard"
        : "/home";
      const from = location.state?.from || defaultRoute;
      navigate(from, { replace: true });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const logoutUrl = env.AUTH.LOGOUT;
      await axios.post(logoutUrl);
    } catch (error) {
      console.error("Error durante el logout:", error);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      logoutStore();
      queryClient.clear();
      navigate("/");
    }
  };

  const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission);
  };

  const hasAnyPermission = (requiredPermissions) => {
    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    user,
    isLoading: loginMutation.isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    hasAnyPermission,
    permissions,
    validateToken,
    setToken,
  };
};
