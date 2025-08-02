// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css'; // Importar o CSS da grelha

function ProductList({ products, onAddToCart }) {
  if (!Array.isArray(products) || products.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Nenhum produto encontrado.</p>;
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard
          key={product._id} 
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;
