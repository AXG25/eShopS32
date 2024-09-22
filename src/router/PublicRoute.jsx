import { Outlet } from 'react-router-dom';
import ResponsiveLayout from '../layouts/ResponsiveLayout';

const PublicRoute = () => {
  return (
    <ResponsiveLayout>
      <Outlet />
    </ResponsiveLayout>
  );
};

export default PublicRoute;