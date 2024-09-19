// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Simular una verificación de token
          // En una aplicación real, aquí harías una petición al backend
          setUser({ id: '1', name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com' });
        } catch (error) {
          console.error('Error al validar el token:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Simular una petición de login
      // En una aplicación real, aquí harías una petición al backend
      const user = { id: '1', name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com' };
      setUser(user);
      localStorage.setItem('authToken', 'token_ejemplo');
      return user;
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};