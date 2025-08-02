import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (children.type.name.startsWith('Admin') && !user.isAdmin) {
    alert('Acesso negado. Apenas administradores podem aceder a esta página.');
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
