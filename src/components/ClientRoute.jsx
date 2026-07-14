import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store/store';

function ClientRoute({ children }) {
  const { user, authLoading } = useStore();

  if (authLoading) return null;

  // If user is an admin, strictly block them from the client storefront
  // and redirect them to the admin dashboard.
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ClientRoute;
