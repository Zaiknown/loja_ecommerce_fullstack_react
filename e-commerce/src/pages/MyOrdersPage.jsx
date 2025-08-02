import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>A carregar os seus pedidos...</p>;
  }

  return (
    <main className="content" style={{ padding: '2rem' }}>
      <h2>Os Meus Pedidos</h2>
      {orders.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <h4>Pedido ID: {order._id}</h4>
            <p>Data: {new Date(order.createdAt).toLocaleDateString('pt-PT')}</p>
            <p>Total: {order.totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
            <h5>Itens:</h5>
            <ul>
              {order.orderItems.map(item => (
                <li key={item.product}>{item.name} (x{item.quantity})</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </main>
  );
}

export default MyOrdersPage;
