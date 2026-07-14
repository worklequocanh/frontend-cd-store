import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) return null;

  if (!user) {
    // If it's an admin route, redirect to the new admin login page instead of the client auth page
    if (adminOnly) {
      return <Navigate to="/admin/login" state={{ from: location.pathname + location.search }} replace />;
    }
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
