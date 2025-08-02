// src/components/AdminMenu.jsx
import './AdminMenu.css';
import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminMenu() {
  const activeStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '5px'
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <NavLink 
        to="/admin/products" 
        style={({ isActive }) => isActive ? activeStyle : { color: 'inherit', textDecoration: 'none', padding: '10px' }}
      >
        Gerir Produtos
      </NavLink>
      <NavLink 
        to="/admin/orders" 
        style={({ isActive }) => isActive ? activeStyle : { color: 'inherit', textDecoration: 'none', padding: '10px' }}
      >
        Gerir Pedidos
      </NavLink>
    </div>
  );
}

export default AdminMenu;
