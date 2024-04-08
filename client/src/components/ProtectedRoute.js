import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Assuming the authentication status is stored in localStorage for simplicity
  const user = localStorage.getItem('userId');

  if (!user) {
    // User not logged in, redirect to unauthorized or login page
    return <Navigate to="/unauthorized" />;
  }

  // User is logged in, allow access to the route
  return children;
};

export default ProtectedRoute;