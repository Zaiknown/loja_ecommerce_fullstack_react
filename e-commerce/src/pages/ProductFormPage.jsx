import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/api';
import { toast } from 'react-toastify';
import './ProductFormPage.css';

function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: ''
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchProductData = async () => {
        try {
          const response = await getProductById(id);
          setFormData(response.data);
        } catch (error) {
          console.error('Erro ao buscar dados do produto:', error);
          toast.error('Não foi possível carregar os dados do produto.');
        }
      };
      fetchProductData();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(id, formData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct(formData);
        toast.success('Produto criado com sucesso!');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Falha ao salvar o produto.');
    }
  };

  return (
    <main className="content product-form-container">
      <div className="product-form">
        <h2>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome do Produto</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Preço</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">URL da Imagem</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              className="form-control"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Atualizar Produto' : 'Criar Produto'}
            </button>
            <Link to="/admin/products" className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ProductFormPage;