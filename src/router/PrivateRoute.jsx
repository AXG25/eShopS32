// src/components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PropTypes } from "prop-types";
import ResponsiveLayout from "../layouts/ResponsiveLayout";

const PrivateRoute = ({ excludeFromLayout = false }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (excludeFromLayout) {
    return <Outlet />;
  }

  return (
    <ResponsiveLayout>
      <Outlet />
    </ResponsiveLayout>
  );
};

PrivateRoute.propTypes = {
  excludeFromLayout: PropTypes.bool.isRequired,
};

export default PrivateRoute;
