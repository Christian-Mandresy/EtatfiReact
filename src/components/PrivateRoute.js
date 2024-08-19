import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ element, isAuthenticated, fallbackPath }) => {
  return isAuthenticated ? (
    <Outlet />
  ) : (
      <Navigate to={fallbackPath} replace />

  );
};

export default PrivateRoute;
