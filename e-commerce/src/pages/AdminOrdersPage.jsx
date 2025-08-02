import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../services/api';
import AdminMenu from '../components/AdminMenu.jsx';
import './AdminPage.css';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Erro ao buscar todos os pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p>A carregar pedidos...</p>;
  }

  return (
    <main className="content">
      <AdminMenu />
      <div className="admin-header">
        <h2>Gerir Pedidos</h2>
      </div>
      
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CLIENTE</th>
            <th>DATA</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name || 'Utilizador Apagado'}</td>
              <td>{new Date(order.createdAt).toLocaleDateString('pt-PT')}</td>
              <td>{order.totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default AdminOrdersPage;
