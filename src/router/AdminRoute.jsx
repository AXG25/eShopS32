import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ResponsiveLayout from "../layouts/ResponsiveLayout";

const AdminRoute = () => {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission("admin")) {
    return <Navigate to="/home" replace />;
  }

  return (
    <ResponsiveLayout>
      <Outlet />
    </ResponsiveLayout>
  );
};

export default AdminRoute;
