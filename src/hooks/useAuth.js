// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';

// Simula un servicio de autenticación
const authService = {
  login: async (credentials) => {
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (credentials.email === 'usuario@ejemplo.com' && credentials.password === 'password123') {
      return { 
        user: { id: '1', name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com' },
        token: 'fake-jwt-token'
      };
    }
    throw new Error('Credenciales inválidas');
  },
  validateToken: async (token) => {
    // Simula la validación del token
    await new Promise(resolve => setTimeout(resolve, 500));
    if (token === 'fake-jwt-token') {
      return { id: '1', name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com' };
    }
    throw new Error('Token inválido');
  }
};

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, setUser, setToken, logout: logoutStore } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const validateTokenQuery = useQuery({
    queryKey: ['validateToken', token],
    queryFn: () => authService.validateToken(token),
    enabled: !!token,
    retry: false,
    onSuccess: (validatedUser) => {
      setUser(validatedUser);
    },
    onError: () => {
      logoutStore();
      navigate('/login');
    },
  });

  useEffect(() => {
    if (token && !user) {
      validateTokenQuery.refetch();
    }
  }, [token, user]);

  const login = async (credentials) => {
    const result = await loginMutation.mutateAsync(credentials);
    navigate('/');
    return result;
  };

  const logout = () => {
    logoutStore();
    queryClient.clear();
    navigate('/login');
  };

  return {
    user,
    isLoading: loginMutation.isLoading || validateTokenQuery.isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};