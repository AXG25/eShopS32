import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";

// Simula un servicio de autenticación
const authService = {
  login: async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (
      credentials.email === "usuario@ejemplo.com" &&
      credentials.password === "password123"
    ) {
      return {
        user: {
          id: "1",
          name: "Usuario Ejemplo",
          email: "usuario@ejemplo.com",
        },
        token: "fake-jwt-token",
        permissions: ["user"],
      };
    }
    if (
      credentials.email === "admin@ejemplo.com" &&
      credentials.password === "admin123"
    ) {
      return {
        user: { id: "2", name: "Admin Ejemplo", email: "admin@ejemplo.com" },
        token: "fake-admin-jwt-token",
        permissions: ["user", "admin", "customization"],
      };
    }
    throw new Error("Credenciales inválidas");
  },
  validateToken: async (token) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (token === "fake-jwt-token") {
      return {
        id: "1",
        name: "Usuario Ejemplo",
        email: "usuario@ejemplo.com",
        permissions: ["user"],
      };
    }
    if (token === "fake-admin-jwt-token") {
      return {
        id: "2",
        name: "Admin Ejemplo",
        email: "admin@ejemplo.com",
        permissions: ["user", "admin", "customization"],
      };
    }
    throw new Error("Token inválido");
  },
};

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    user,
    token,
    permissions,
    setUser,
    setToken,
    setPermissions,
    logout: logoutStore,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      setPermissions(data.permissions);
      queryClient.setQueryData(["user"], data.user);
    },
    onError: (error) => {
      console.error("Error durante el login:", error);
      // Aquí podrías manejar errores específicos, como mostrar un mensaje al usuario
    },
  });

  const validateTokenQuery = useQuery({
    queryKey: ["validateToken", token],
    queryFn: () => authService.validateToken(token),
    enabled: !!token,
    retry: false,
    onSuccess: (validatedUser) => {
      setUser(validatedUser);
      setPermissions(validatedUser.permissions);
    },
    onError: () => {
      logoutStore();
      navigate("/login", { state: { from: location.pathname } });
    },
  });

  useEffect(() => {
    if (token && !user) {
      validateTokenQuery.refetch();
    }
  }, [token, user, validateTokenQuery]);

  const login = async (credentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      const defaultRoute = result.permissions.includes("admin")
        ? "/dashboard"
        : "/home";
      const from = location.state?.from || defaultRoute;
      navigate(from, { replace: true });
      return result;
    } catch (error) {
      // Manejar el error de login aquí si es necesario
      throw error;
    }
  };

  const logout = () => {
    logoutStore();
    queryClient.clear();
    navigate("/");
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
    isLoading: loginMutation.isLoading || validateTokenQuery.isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    hasAnyPermission,
    permissions,
  };
};
