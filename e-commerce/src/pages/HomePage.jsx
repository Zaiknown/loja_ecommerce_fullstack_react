import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import './HomePage.css';

function HomePage({ products, onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    let processedProducts = [...products];

    if (searchTerm) {
      processedProducts = processedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === 'price-asc') {
      processedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      processedProducts.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(processedProducts);
  }, [searchTerm, sortOrder, products]);

  return (
    <main className="content">
      <div className="home-controls">
        <h2>Produtos em Destaque</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Ordenar por</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>
      
      <ProductList products={displayedProducts} onAddToCart={onAddToCart} />
    </main>
  );
}

export default HomePage;
