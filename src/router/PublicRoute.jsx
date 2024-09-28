// src/router/PublicRoute.jsx

import { Outlet, useLocation } from 'react-router-dom';
import ResponsiveLayout from '../layouts/ResponsiveLayout';

const PublicRoute = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <ResponsiveLayout isLandingPage={isLandingPage}>
      <Outlet />
    </ResponsiveLayout>
  );
};

export default PublicRoute;