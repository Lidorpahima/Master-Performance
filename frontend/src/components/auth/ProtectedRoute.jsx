import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

// Protected route for authenticated users
export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

// Protected route for admin users
export const AdminRoute = ({ redirectPath = '/dashboard' }) => {
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated && user?.role == 'admin' ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
