/* eslint-disable no-useless-catch */
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import axios from "axios";
import env from "../config/env";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    user,
    permissions,
    logout: logoutStore,
    login: loginStore,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginStore,
    onSuccess: (data) => {
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
  };
};
