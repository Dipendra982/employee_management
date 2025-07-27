import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin-only route and user is not admin, redirect to appropriate dashboard
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/staff/dashboard" replace />;
  }

  // If staff trying to access admin routes, redirect to staff dashboard
  if (location.pathname.startsWith('/admin') && user?.role !== 'admin') {
    return <Navigate to="/staff/dashboard" replace />;
  }

  // If admin trying to access staff routes, redirect to admin dashboard
  if (location.pathname.startsWith('/staff') && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
