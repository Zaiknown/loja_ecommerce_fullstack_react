import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProductsForAdmin, deleteProduct } from '../services/api';
import AdminMenu from '../components/AdminMenu.jsx';
import Modal from '../components/Modal.jsx';
import { toast } from 'react-toastify';
import './AdminPage.css';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await getAllProductsForAdmin();
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        toast.success('Produto apagado com sucesso!');
        fetchProducts();
      } catch (error) {
        toast.error('Erro ao apagar o produto.');
        console.error('Erro ao apagar produto:', error);
      } finally {
        closeDeleteModal();
      }
    }
  };

  return (
    <>
      <main className="content">
        <AdminMenu />
        <div className="admin-header">
          <h2>Gerir Produtos</h2>
          <Link to="/admin/products/new">
            <button className="btn btn-primary">Adicionar Novo Produto</button>
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>
                    {typeof product.price === 'number'
                      ? product.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })
                      : 'Preço inválido'
                    }
                  </td>
                  <td>
                    <Link to={`/admin/products/edit/${product._id}`}>
                      <button className="btn btn-warning" style={{ marginRight: '8px' }}>Editar</button>
                    </Link>
                    <button onClick={() => openDeleteModal(product._id)} className="btn btn-danger">Apagar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Eliminação"
      >
        <p>Tem a certeza que deseja apagar este produto? Esta ação não pode ser desfeita.</p>
      </Modal>
    </>
  );
}

export default AdminProductsPage;

