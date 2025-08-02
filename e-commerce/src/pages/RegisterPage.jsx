import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { toast } from 'react-toastify';
import './AuthForm.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registo efetuado com sucesso! Por favor, faça o login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao efetuar o registo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content">
      <div className="auth-container">
        <h2>Criar Conta</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Palavra-passe</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'A registar...' : 'Registar'}
          </button>
        </form>
        <p className="auth-link">
          Já tem conta? <Link to="/login">Faça o login</Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
