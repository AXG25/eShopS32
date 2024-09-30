// src/router/AppRouter.jsx

import { Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage"; // Importa la nueva LandingPage
import ProfilePage from "../pages/ProfilePage";
import OrdersPage from "../pages/OrdersPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";
import CustomizationDashboard from "../Components/dashboard/CustomizationDashboard";
import CartView from "../Components/cart/CartView";
import DashboardPage from "../pages/DashboardPage";
import PublicRoute from "./PublicRoute";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";
import CategoriesPage from "../pages/CategoriesPage";
import AboutUsPage from "../pages/AboutUsPage";
import ContactUsPage from "../pages/ContactUsPage";

const AppRouter = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/nosotros" element={<ContactUsPage />} />
      </Route>

      {/* Rutas públicas sin ResponsiveLayout*/}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route
        path="/terms-and-conditions"
        element={<TermsAndConditionsPage />}
      />

      {/* Rutas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Rutas de administrador */}
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customization" element={<CustomizationDashboard />} />
      </Route>

      {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;