import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';

function GuestRoute({ children }) {
  const { user, authLoading } = useStore();
  const location = useLocation();

  if (authLoading) return null;

  if (user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}

export default GuestRoute;
