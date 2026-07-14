import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) return null;

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
