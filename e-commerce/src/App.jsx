// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Spinner from './components/Spinner.jsx';

// Importar todas as páginas
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminProductsPage from './pages/AdminProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (productToAdd) => {
    const existingItem = cartItems.find(item => item._id === productToAdd._id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === productToAdd._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productIdToRemove) => {
    setCartItems(cartItems.filter(item => item._id !== productIdToRemove));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Componente Wrapper para a HomePage para lidar com a busca de dados paginados
  const HomePageWrapper = () => {
    const { pageNumber } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
      const fetchProductsData = async () => {
        setLoading(true);
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await axios.get(`${apiUrl}/products?pageNumber=${pageNumber || 1}`);
          setProducts(response.data.products || []);
          setPage(response.data.page || 1);
          setPages(response.data.pages || 1);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProductsData();
    }, [pageNumber]);

    if (loading) return <Spinner />;
    
    return <HomePage products={products} onAddToCart={handleAddToCart} page={page} pages={pages} />;
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            limit={1}
          />
          <Header cartCount={cartItems.length} />
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/page/:pageNumber" element={<HomePageWrapper />} />
            <Route 
              path="/product/:id" 
              element={<ProductDetailPage onAddToCart={handleAddToCart} />} 
            />
            <Route
              path="/carrinho"
              element={<CartPage cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} />}
            />

            {/* Rotas de Autenticação */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas Protegidas para Utilizadores Logados */}
            <Route
              path="/checkout"
              element={<ProtectedRoute><CheckoutPage cartItems={cartItems} clearCart={clearCart} /></ProtectedRoute>}
            />
            <Route
              path="/myorders"
              element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>}
            />

            {/* Rotas de Administração Protegidas */}
            <Route
              path="/admin/products"
              element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/orders"
              element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/products/new"
              element={<ProtectedRoute><ProductFormPage /></ProtectedRoute>}
            />
            <Route
              path="/admin/products/edit/:id"
              element={<ProtectedRoute><ProductFormPage /></ProtectedRoute>}
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;