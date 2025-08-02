// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 1. Adicionar um estado para controlar o carregamento inicial
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Token inválido no arranque, a remover.", error);
        localStorage.removeItem('token');
      }
    }
    // 2. Definir o carregamento como concluído, quer tenha encontrado um token ou não
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 3. Expor o estado 'loading' no valor do contexto
  const value = {
    user,
    loading, // Adicionado aqui
    login,
    logout
  };

  // 4. Não renderizar nada enquanto o estado inicial está a ser verificado
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
