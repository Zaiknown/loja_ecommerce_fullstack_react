// backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ROTA DE REGISTO
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Utilizador já existe.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // DEBUG: Vamos ver o que o servidor está a ler do banco de dados
    console.log(`--- DEBUG LOGIN ---`);
    console.log(`Utilizador encontrado: ${user.name}`);
    console.log(`isAdmin no banco de dados: ${user.isAdmin}`);
    console.log(`--- FIM DEBUG ---`);

    // CORREÇÃO CRUCIAL AQUI:
    // Garantir que 'isAdmin' está incluído no objeto que gera o token.
    const token = jwt.sign(
      { id: user._id, name: user.name, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'uma_chave_secreta_padrao',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;
