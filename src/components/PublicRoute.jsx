import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Don't redirect while loading
  if (loading) {
    return children;
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/staff/dashboard" replace />;
    }
  }

  // If not authenticated, allow access to public routes
  return children;
};

export default PublicRoute;
