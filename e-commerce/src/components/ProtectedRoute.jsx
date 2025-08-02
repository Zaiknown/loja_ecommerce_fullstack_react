// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx'; // Vamos mostrar um spinner enquanto esperamos

function ProtectedRoute({ children }) {
  // 1. Obter o 'user' e o novo estado 'loading' do contexto
  const { user, loading } = useAuth();

  // 2. Se ainda estiver a verificar a autenticação, mostrar um spinner
  if (loading) {
    return <Spinner />;
  }

  // 3. Se o carregamento terminou e não há utilizador, redirecionar
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // A lógica para verificar se é admin continua a mesma, mas agora só corre
  // depois de o carregamento ter terminado.
  // (Esta parte pode ser adaptada para diferentes níveis de permissão)
  if (children.type.name.startsWith('Admin') && !user.isAdmin) {
    alert('Acesso negado. Apenas administradores podem aceder a esta página.');
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
