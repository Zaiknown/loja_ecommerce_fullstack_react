import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/api';
import { toast } from 'react-toastify';

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
    <main className="content" style={{ padding: '2rem', color: '#fff' }}>
      <h2>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nome do Produto</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#3a3f4b', color: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Preço</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#3a3f4b', color: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '5px' }}>URL da Imagem</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#3a3f4b', color: '#fff' }}
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
    </main>
  );
}

export default ProductFormPage;
