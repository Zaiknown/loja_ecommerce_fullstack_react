import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage({ cartItems, onRemoveFromCart }) {
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return (
    <main className="content">
      <h2>O seu Carrinho de Compras</h2>
      {cartItems.length === 0 ? (
        <p>O seu carrinho está vazio. <Link to="/">Continue a comprar</Link>.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="cart-item-image"
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/2c333f/ecf0f1?text=Imagem'; }}
                />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>Quantidade: {item.quantity}</p>
                  <p>Preço: {(item.price * item.quantity).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                  <div className="cart-item-actions">
                    <button onClick={() => onRemoveFromCart(item._id)} className="btn btn-danger">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Resumo do Pedido</h3>
            <h4>
              Valor Total: {totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
            </h4>
            <Link to="/checkout">
              <button className="btn btn-primary">
                Ir para o Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default CartPage;
