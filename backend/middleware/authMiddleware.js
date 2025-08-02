// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
  let token;

  // Verifica se o cabeçalho de autorização existe e começa com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do cabeçalho (ex: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'uma_chave_secreta_padrao');

      // Anexa as informações do utilizador ao objeto 'req' para que as rotas futuras possam usá-las
      // Procura o utilizador pelo ID do token, mas não inclui a sua palavra-passe
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Passa para a próxima função (a rota real)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

module.exports = { protect };
