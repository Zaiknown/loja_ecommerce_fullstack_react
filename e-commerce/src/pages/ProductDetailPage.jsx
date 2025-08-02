import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import Spinner from '../components/Spinner.jsx';
import { toast } from 'react-toastify';
import './ProductDetailPage.css'; 

function ProductDetailPage({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
        toast.error("Não foi possível carregar os detalhes do produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!product) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <main className="content">
      <div className="product-detail-layout">
        <div className="product-detail-image-wrapper">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-detail-image"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/500x500/2c333f/ecf0f1?text=Imagem+Indisponível'; }}
          />
        </div>
        <div className="product-detail-info-wrapper">
          <h2>{product.name}</h2>
          <p className="product-detail-price">
            {product.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
          </p>
          <p className="product-detail-description">
            Esta é uma descrição detalhada do produto. Aqui podemos falar sobre as suas características, materiais, e porque é uma excelente compra. Como ainda não temos esta informação na nossa base de dados, estamos a usar um texto genérico.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              onAddToCart(product);
              toast.success(`${product.name} foi adicionado ao carrinho!`);
            }} 
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
