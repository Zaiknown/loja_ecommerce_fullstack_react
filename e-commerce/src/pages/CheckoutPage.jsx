// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css'; // Importar o novo CSS

function CheckoutPage({ cartItems, clearCart }) {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      orderItems: cartItems,
      shippingAddress,
      totalPrice
    };

    try {
      await createOrder(orderData);
      toast.success('Pedido realizado com sucesso!');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar o pedido:', error);
      toast.error('Ocorreu um erro ao finalizar o seu pedido.');
    }
  };

  return (
    <main className="content">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <div className="checkout-form-container">
          <h3>Endereço de Entrega</h3>
          <form onSubmit={handleSubmit} id="checkout-form">
            <div className="form-group">
              <label htmlFor="address">Morada</label>
              <input type="text" id="address" name="address" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="city">Cidade</label>
              <input type="text" id="city" name="city" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Código Postal</label>
              <input type="text" id="postalCode" name="postalCode" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="country">País</label>
              <input type="text" id="country" name="country" onChange={handleChange} required />
            </div>
          </form>
        </div>

        <div className="checkout-summary-container">
          <h3>Resumo do Pedido</h3>
          <ul className="summary-item-list">
            {cartItems.map(item => (
              <li key={item._id} className="summary-item">
                <span>{item.name} (x{item.quantity})</span>
                <span>{(item.price * item.quantity).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Total:</span>
            <span>{totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          {/* Este botão submete o formulário com o id 'checkout-form' */}
          <button type="submit" form="checkout-form" className="btn btn-primary">
            Finalizar Compra
          </button>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
