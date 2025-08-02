// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const handleAddToCartClick = (e) => {
    e.preventDefault(); 
    onAddToCart(product);
    toast.success(`${product.name} foi adicionado ao carrinho!`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-image-container">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-image" 
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x300/2c333f/ecf0f1?text=Imagem'; }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          {/* NOVO: Adicionada uma pequena descrição */}
          <p className="product-description">
            Uma breve descrição sobre este produto incrível que vai mudar a sua vida.
          </p>
          <p className="product-price">
            {product.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
          </p>
          <button
            className="btn btn-primary"
            onClick={handleAddToCartClick}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
