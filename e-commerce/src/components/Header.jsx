// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Header.css';

function Header({ cartCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">MinhaLoja</Link>
      </div>
      <nav className="navigation">
        <Link to="/">Home</Link>
        {user && user.isAdmin && <Link to="/admin/products">Admin</Link>}
      </nav>
      <div className="cart-icon" style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          // Se o utilizador estiver logado
          <>
            <span style={{ marginRight: '1rem' }}>Olá, {user.name}</span>
            <Link to="/myorders" style={{ marginRight: '1rem' }}>Os Meus Pedidos</Link>
            <button onClick={handleLogout} style={{ marginRight: '1rem' }}>Sair</button>
          </>
        ) : (
          // Se não estiver logado
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register" style={{ marginRight: '1rem' }}>Registar</Link>
          </>
        )}
        <Link to="/carrinho">🛒 Carrinho ({cartCount})</Link>
      </div>
    </header>
  );
}

export default Header;
