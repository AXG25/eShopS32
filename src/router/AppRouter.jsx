// src/router/AppRouter.jsx
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import OrdersPage from "../pages/OrdersPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";
import CustomizationDashboard from "../Components/dashboard/CustomizationDashboard";
import CartView from "../Components/cart/CartView";
import DashboardPage from "../pages/DashboardPage";

const AppRouter = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Ruta de inicio fuera del ResponsiveLayout */}
      <Route element={<PrivateRoute excludeFromLayout />}>
        <Route path="/customization" element={<CustomizationDashboard />} />
      </Route>

      {/* Rutas dentro del ResponsiveLayout */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
